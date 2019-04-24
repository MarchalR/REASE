
const UrlSeloger = require('./urlObject/urlSeloger');
const AbstractUrl = require('./urlObject/AbstractUrl');
class UrlBuilderUtils {
    //http://www.seloger.com/list.htm?idtt=2&naturebien=1,2,4&idtypebien=1&ci=750101&tri=initial&pxmax=450000

    //** Constructor **//
    constructor(bodyRequest){
        this.bodyRequest = bodyRequest;
        this._firstUrlBySiteList = [];
        this.fillFirstUrlBySiteList();

        // this.abstractUrl = new AbstractUrl();
        // console.log(this.abstractUrl.url);
        //
        // this.selogerUrl = new UrlSeloger();
        // console.log(this.selogerUrl.url);
    }

    //** Getters **//
    get firstUrlBySiteList(){
        return this._firstUrlBySiteList;

    }

    //** Setters **//
    set firstUrlBySiteList(url){
        this._firstUrlBySiteList.push(url);
    }

    //** Methods **//
    fillFirstUrlBySiteList(){

        let selogerUrl = new UrlSeloger(this.bodyRequest);
        // this.firstUrlBySiteList = {Seloger : selogerUrl.url};
        // this.firstUrlBySiteList = {Seloger : selogerUrl.url};
        this.firstUrlBySiteList = {Seloger : selogerUrl.url};
    }

}

module.exports = UrlBuilderUtils;