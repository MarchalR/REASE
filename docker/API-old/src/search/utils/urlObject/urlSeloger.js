const AbstractUrl = require('./AbstractUrl');
class UrlSeloger  extends AbstractUrl {
    constructor(bodyRequest) {
        super();
        this._url = "http://www.seloger.com/list.htm?";
        this.parseBodyRequest(bodyRequest);
    }

    //** Methods **//
    parseBodyRequest(bodyRequest) {
        console.log(this._url);
        console.log(bodyRequest);
        this.setTransactionType(bodyRequest.transactionType);
        this.setNatureBienType();
        this.setBienType(bodyRequest.bienType);
    }

    setTransactionType(param){
        if(param === "location"){
            this.addParamUrl("idtt=1&");
        }
        else if(param === "vente"){
            this.addParamUrl("idtt=2&");
        }
    }

    setNatureBienType(){
        this.addParamUrl("naturebien=1&");
    }

    setBienType(param){
        if(param === "appartement"){
            this.addParamUrl("idtypebien=1,9&");
        }
        else if(param === "maison"){
            this.addParamUrl("idtypebien=2,14,13&");
        }
    }
}
module.exports = UrlSeloger;