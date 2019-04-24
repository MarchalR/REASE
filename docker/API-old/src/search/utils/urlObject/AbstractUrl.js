class AbstractUrl {
    //** Constructor ** //
    constructor(){
    }

    //** Getters **//
    get url(){
        return this._url;
    }

    //** Setters **//
    set url(url){
        this._url = url;
    }

    //** Methods **//
    addParamUrl(param){
        this._url = this._url+param;
    }
}

module.exports = AbstractUrl;