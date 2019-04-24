const Docker = require('dockerode');
const docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

// CONSTRUCTOR
function DockerUtils(firstURL) {
    this.firstUrl = firstURL;
    this.listContainersPromise = docker.listContainers({all: true});
    this.scraperListId = [];
    this.scraperRdyListId = [];
    this.retryCount = 0;
    this.returnData = {};
    console.log("inside dockerUtils : ");
    console.log(this.firstUrl);
}

// "METHODS"
DockerUtils.prototype.run = function() {
    this.getScraperContainersListPromise()
        .then((containers) => {
            for (let i = 0; i < containers.length; i++) {
                if (containers[i].Names.toString().indexOf("scraper") !== -1) {
                    this.addToScraperList(containers[i].Id, "wait");
                }
            }
        })
        .then(()=>{
            return this.checkReadyScraper();
        })
        .catch(e => console.log(e));
};

DockerUtils.prototype.checkReadyScraper = function() {
    for (let i = 0; i < this.scraperListId.length; i++) {
        this.exec("getStatus", this.scraperListId[i].id);
    }
};

DockerUtils.prototype.resetAllScraper = function() {
    for (let i = 0; i < this.scraperListId.length; i++) {
        let container = docker.getContainer(this.scraperListId[i]);
        this.runExec(container, "killall -HUP tor");
    }
};

DockerUtils.prototype.getScraperContainersListPromise = function() {
    return this.listContainersPromise;
};

DockerUtils.prototype.exec = function(type, containerId){
    let container = docker.getContainer(containerId);
    if (type === "getStatus"){
        return this.runExec(container, 'cat /home/immobot/status');
    }
};

DockerUtils.prototype.scrap = function() {
    let scraperRdyNumber = this.scraperRdyListId.length - 1;
    let min = Math.ceil(0);
    let max = Math.floor(scraperRdyNumber);
    let random = Math.floor(Math.random() * (max - min +1)) + min;
    console.log("random number: "+random);
    let container = docker.getContainer(this.scraperRdyListId[random]);
    // this.runExec(container, '/home/immobot/scrap.sh "http://www.seloger.com/list.htm?idtt=2&naturebien=1,2,4&idtypebien=1&ci=750101&tri=initial&pxmax=450000"');
    this.runExec(container, '/home/immobot/scrap.sh "'+this.firstUrl+'"');
};

DockerUtils.prototype.addToScraperList = function(containerId,status) {
    this.scraperListId.push({id: containerId, status: status});
};

DockerUtils.prototype.getScraperList = function() {
    return this.scraperListId;
};

DockerUtils.prototype.getData = function() {
    return this.returnData;
};

DockerUtils.prototype.changeStatusToReady = function (containerId){
    for (let i = 0; i < this.scraperListId.length; i++) {
        if(this.scraperListId[i].id === containerId){
            this.scraperListId[i].status = "ready";
        }
    }
};

DockerUtils.prototype.runExec = function (container, cmd) {

    let options = {
        Cmd: [ '/bin/bash', '-c', cmd ],
        AttachStdout: true,
        AttachStderr: true
    };


    container.exec(options, (err, exec) => {
        if (err) return console.log(err); //return error
        exec.start((err, stream) => {
            if (err){
                console.log("error : "+err);
                return reject(err); //return error
            }

            if (cmd === "cat /home/immobot/status"){
                let newStream = require('stream');
                let logStream = new newStream.PassThrough();

                const chunks = [];
                logStream.on('data', (chunk) => {
                    chunks.push(chunk.toString('utf8'));
                });

                stream.on('end', ()=>{
                    // logStream.end('!stop!');
                    logStream.end();
                });

                logStream.on('end', ()=>{
                    console.log(chunks);
                    if (chunks.toString('utf8').indexOf("ready") !== -1){
                        this.changeStatusToReady(container.id);
                        this.scraperRdyListId.push(container.id);
                        if(this.scraperRdyListId.length === 3 ) {
                            this.scrap();
                        }
                    }
                    });

                container.modem.demuxStream(stream, logStream, process.stderr);
            }
            // else if (cmd === '/home/immobot/scrap.sh "http://www.seloger.com/list.htm?idtt=2&naturebien=1,2,4&idtypebien=1&ci=750101&tri=initial&pxmax=450000"'){
            else if (cmd === '/home/immobot/scrap.sh "'+this.firstUrl+'"'){
                const chunks = [];
                stream.on('data', (chunk) => {
                    chunks.push(chunk.toString('utf8'));
                });
                stream.on('end', ()=>{
                    console.log(chunks.length);
                    if(chunks.toString().indexOf("[scrapy.core.engine] DEBUG: Crawled (200) <GET") >= 0){
                        console.log("200");
                        console.log("on lance le scrape sur un des scraper rdy");
                        this.runExec(container, "cat /home/immobot/seloger.json");
                    }
                    else if (this.retryCount < 5){
                        console.log("pas 200");
                        console.log("on relance le processus");
                        this.scraperRdyListId = [];
                        this.retryCount++;
                        this.checkReadyScraper();
                    }
                    else {
                        console.log("Stop retry : Problème avec seloger.");
                        this.resetAllScraper();
                    }
                });

            }
            // LIRE LE fichier seloger.json
            else if (cmd === "cat /home/immobot/seloger.json"){
                const chunks = [];
                stream.on('data', (chunk) => {
                    chunks.push(chunk.toString());
                    // chunks.push(chunk);
                    // chunks.push(chunk.toJSON());
                });
                stream.on('end', ()=>{
                    console.log("Lecture du fichier : ");
                    let dataString = chunks.toString();
                    dataString = dataString.slice(8);
                    try {
                        this.returnData = JSON.parse(dataString);
                    } catch (e) {
                        console.error("Parsing error:", e);
                    }
                    console.log("runexec: ");
                    console.log(this.getData());
                    container.modem.demuxStream(stream, process.stdout, process.stderr);
                    this.runExec(container, "rm -v /home/immobot/seloger.json");
                });
            }
            // SUPPRIMER le fichier seloger.json
            else if (cmd === "rm -v /home/immobot/seloger.json"){
                const chunks = [];
                stream.on('data', (chunk) => {
                    chunks.push(chunk.toString());
                });
                stream.on('end', ()=>{
                    console.log("Suppression du fichier !!");
                    let dataString = chunks.toString();
                    dataString = dataString.slice(8);
                    console.log(dataString);
                });
            }
            //RESET SCRAPERS
            else if (cmd === "killall -HUP tor"){
                const chunks = [];
                stream.on('data', (chunk) => {
                    chunks.push(chunk.toString());
                });
                stream.on('end', ()=>{
                    console.log("Reset Scraper !!");
                    let dataString = chunks.toString();
                    dataString = dataString.slice(8);
                    console.log(dataString);
                });
            }

            // container.modem.demuxStream(stream, logStream, process.stderr);
            exec.inspect(function(err, data) {
                if (err){
                    console.log("error : "+err);
                    //looks like everything was ok, lets resolve
                    return reject(err);
                }
            });
        });
    });
};

module.exports = DockerUtils;