const AbstractUrl = require('./AbstractUrl');
class UrlSeloger  extends AbstractUrl {
    constructor(bodyRequest) {
        super();
        this._url = "http://www.seloger.com/list.htm?";
        this.parseBodyRequest(bodyRequest);
    }

    //** Methods **//
    //http://www.seloger.com/list.htm?idtt=2&naturebien=1,2,4&idtypebien=1&ci=750101&tri=initial&pxmax=450000
    parseBodyRequest(bodyRequest) {
        console.log(this._url);
        console.log(bodyRequest);
        this.setTransactionType(bodyRequest.transactionType);
        this.setNatureBienType();
        this.setBienType(bodyRequest.bienType);
        this.setZip(bodyRequest.postal);
        this.setTri();
        this.setPrixMax(bodyRequest.prixMax);
    }

    setPrixMax(param){
        this.addParamUrl("pxmax="+param);
    }

    setTri(){
        this.addParamUrl("tri=initial&");
    }

    setZip(param){
        let zip = "ci=";
        for (let i = 0; i < param.length; i++){
            if(i === 0){
                zip = zip+param[i];
            }
            else {
                zip = zip+","+param[i];
            }
        }
        this.addParamUrl(zip+"&");
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