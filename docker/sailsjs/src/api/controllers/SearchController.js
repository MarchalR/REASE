/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const DockerUtils = require('../utils/dockerUtils');
const UrlBuilderUtils = require('../utils/urlBuilderUtils');

module.exports = {
    form: function (req, res) {

        res.view("form");
    },

    index: function (req, res) {

        let urlBuilderUtils = new UrlBuilderUtils(req.body);
        let firstUrlBySiteList = urlBuilderUtils.firstUrlBySiteList;
        // console.log(firstUrlBySiteList);
        // console.log(firstUrlBySiteList[0].Seloger);
        let dockerUtils = new DockerUtils(firstUrlBySiteList[0].Seloger);
        dockerUtils.run();

        return res.send('Hi !');
    },
};
