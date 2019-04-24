const DockerUtils = require('./utils/dockerUtils');
const UrlBuilderUtils = require('./utils/urlBuilderUtils');


function REST_SEARCH(router) {
    let self = this;
    self.handleRoutes(router);
}

REST_SEARCH.prototype.handleRoutes= function(router) {

    router.post("/search", function(req,res){
    // router.post("/search", vayder.validateBody(blahSchema),function(req,res){ // POUR GERER LES VALIDATION


        // let dockerUtils = new DockerUtils();
        // dockerUtils.run();

        let urlBuilderUtils = new UrlBuilderUtils(req.body);
        let firstUrlBySiteList = urlBuilderUtils.firstUrlBySiteList;
        console.log(firstUrlBySiteList);
        console.log(firstUrlBySiteList[0].Seloger);


        // function stringify_form(postal) {
        //     let result = JSON.stringify(postal);
        //     return result;
        // }
        // let postal = stringify_form(req.body.postal)



        res.json({"Error" : 200});
    });
    // END search
}


module.exports = REST_SEARCH;
