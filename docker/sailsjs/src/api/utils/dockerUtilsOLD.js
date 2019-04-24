const Docker = require('dockerode');
const docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

// CONSTRUCTOR
function DockerUtils() {
    this.listContainersPromise = docker.listContainers({all: true});
    this.scraperListId = [];
    this.scraperRdyListId = [];
    this.stupidCount = 0;
    this.currContainer = "nothing";
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
        // .then(() => {
        //     return this.scrap();
        // })
        // .then(() => {
        //     return this.runExec(this.currContainer, "cat /home/immobot/seloger.json");
        // })
        // .then(() => {
        //     return this.runExec(this.currContainer, "rm -v /home/immobot/seloger.json");
        // })
        .catch(e => console.log(e));
};

DockerUtils.prototype.checkReadyScraper = function() {
    console.log(this.scraperListId);
    for (let i = 0; i < this.scraperListId.length; i++) {
        // this.exec("getStatus", this.scraperListId[i].id);
        let container = docker.getContainer(this.scraperListId[i].id);
        this.runExec(container, 'cat /home/immobot/status');
    }
};

DockerUtils.prototype.getScraperContainersListPromise = function() {
    return this.listContainersPromise;
};

// DockerUtils.prototype.exec = function(type, containerId){
//     let container = docker.getContainer(containerId);
//     if (type === "getStatus"){
//         return this.runExec(container, 'cat /home/immobot/status');
//     }
//     // else if (type === "scrap") {
//     //     return this.runExec(container, 'torify scrapy crawl seloger -o seloger.json');
//     // }
// };

DockerUtils.prototype.scrap = function() {
    console.log("On SCRAPE !");
    let scraperRdyNumber = this.scraperRdyListId.length - 1;
    let min = Math.ceil(0);
    let max = Math.floor(scraperRdyNumber);
    let random = Math.floor(Math.random() * (max - min +1)) + min;
    console.log("random number: "+random);
    // this.exec("scrap", this.scraperListId[i].id);
    console.log(this.scraperRdyListId);
    console.log(this.scraperRdyListId[random]);
    this.currContainer = docker.getContainer(this.scraperRdyListId[random]);
    console.log(this.currContainer);
    this.runExec(this.currContainer, "torify scrapy crawl seloger -o seloger.json");
};

DockerUtils.prototype.addToScraperList = function(containerId,status) {
    this.scraperListId.push({id: containerId, status: status});
};

DockerUtils.prototype.getScraperList = function() {
    return this.scraperListId;
};

DockerUtils.prototype.changeStatusToReady = function (containerId){
    for (let i = 0; i < this.scraperListId.length; i++) {
        if(this.scraperListId[i].id === containerId){
            this.scraperListId[i].status = "ready";
        }
    }
    // console.log(this.getScraperList());
};

DockerUtils.prototype.runExec = function (container, cmd) {
    console.log(cmd);
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

            // container.modem.demuxStream(stream, process.stdout, process.stderr)

            if (cmd === "cat /home/immobot/status"){
                let newStream = require('stream');
                let logStream = new newStream.PassThrough();

                const chunks = [];
                logStream.on('data', (chunk) => {
                    chunks.push(chunk.toString('utf8'));
                });

                stream.on('end', ()=>{
                    console.log("YOLO")
                    // logStream.end('!stop!');
                    logStream.end();
                });

                logStream.on('end', ()=>{
                    console.log("YOLAAAAA")
                    console.log(chunks);
                    if (chunks.toString('utf8').indexOf("ready") !== -1){
                        console.log("CONTAINER READY !!");
                        this.changeStatusToReady(container.id);
                        this.scraperRdyListId.push(container.id);
                        // console.log(this.scraperRdyListId);
                        this.stupidCount++;
                        onsole.log("WTF : "+this.stupidCount);
                        if(this.stupidCount === 3 ) {
                            console.log("SCRAPE STEUPLAIT");
                            this.scrap();
                        }
                    }

                });
                console.log("Check container rdy ...");
                // container.modem.demuxStream(stream, logStream, process.stderr);
            }
            else if (cmd === "torify scrapy crawl seloger -o seloger.json"){
                console.log("on lance le scrape sur un des scraper rdy !!");
                container.modem.demuxStream(stream, process.stdout, process.stderr)
                this.runExec(this.currContainer, "cat /home/immobot/seloger.json")
            }
            // LIRE LE fichier seloger.json
            else if (cmd === "cat /home/immobot/seloger.json"){
                console.log("Lecture du fichier : ");
                container.modem.demuxStream(stream, process.stdout, process.stderr)
                this.runExec(this.currContainer, "rm -v /home/immobot/seloger.json")
            }
            // SUPPRIMER le fichier seloger.json
            else if (cmd === "rm -v /home/immobot/seloger.json"){
                console.log("Suppression du fichier !!");
                container.modem.demuxStream(stream, process.stdout, process.stderr)
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