import {Injectable} from '@angular/core';
import {Http} from "@angular/http";

/*
  Generated class for the PreferencesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class CodePostauxProvider {
    codePostaux: Array<{ nom: string, cp: number }> = [];


    constructor(public http: Http) {
    }

    async getCP() {
        return new Promise((resolve, reject) =>{
            if (this.codePostaux.length === 0) {
                this.http.get('assets/mapData.geojson').map(res => res.json()).subscribe(data => {
                    for (let feature of data.features)
                        this.codePostaux.push({
                            nom: feature.properties.nom_comm.split("-").join(" "),
                            cp: feature.properties.postal_code
                        });
                    resolve('done');
                });
            } else{
                resolve('done');
            }
        });
    }

    //return the string behind the GetRequest
}
