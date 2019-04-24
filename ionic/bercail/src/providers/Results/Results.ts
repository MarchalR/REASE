import {Injectable} from '@angular/core';
import {Result} from "../../classes/Result";
/*
  Generated class for the ResultProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResultsProvider {
    public results: Array<Result>;

    constructor() {
        this.onInit();
    }

    onInit() {
        this.results = new Array<Result>(20);
        let d : number;
        for(let i = 0; i < this.results.length; i++) {
            d= i+1;
            this.results[i] = new Result("lorem ipsum",((d%15)+1)*10, (d%5)+1, ((d%15)+1)*1000);
            this.results[i].postalCode = 7500+i;
            this.results[i].image =['assets/imgs/appartement.jpg', 'assets/imgs/appartement.jpg'];
            this.results[i].url = "http://www.logic-immo.com/detail-vente-d39bc7b0-6bb3-c928-49fa-959daaeaa146.htm?mea=iad";
        }
    }
}
