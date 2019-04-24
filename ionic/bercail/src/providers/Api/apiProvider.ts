import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
/*
  Generated class for the ResultProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const API_KEY = 'apiKey';
const URL_API = "https://api.rease.fr";
const KEY_GIVER_URL = "/login_check";
const USERNAME = "anonymous";
const PASSWORD = "anonymous";

@Injectable()
export class ApiProvider {

    constructor(public storage: Storage,
                public http: HttpClient) {
    }

    getAllObjets(completeUrl: string) {
        return new Observable((obs) => {
            this.register().subscribe(() => {
                this.http.get(completeUrl).subscribe((res) => {
                    obs.next(res);
                    obs.complete();
                }, error => {
                    obs.error(error);
                    obs.complete();
                });
            }, error => {
                obs.error(error);
                obs.complete();
            });
        });
    }

    register() {
        // récupère la clé
        return new Observable(obs => {
            this.getApiKey().then(apiKey => {
                this.TestKeyValid(apiKey).subscribe(() => {
                    obs.next(apiKey);
                    obs.complete();
                }, () => {
                    this.getKeyFromApi().subscribe((apiKey: string) => {
                        this.setApiKey(apiKey);
                        obs.next(apiKey);
                        obs.complete();
                    }, (error) => {
                        obs.error(error);
                        obs.complete();
                    });
                });
            });
        });


    }

    getApiKey() {
        return this.storage.get(API_KEY);
    }

    setApiKey(hashKey: string): void {
        this.storage.set(API_KEY, hashKey);
    }

    getKeyFromApi() {
        let headerGetKey = new HttpHeaders();
        headerGetKey.append("Content-Type", "application/x-www-form-urlencoded");
        let body = new URLSearchParams();
        body.set('_username', USERNAME);
        body.set('_password', PASSWORD);
        return this.http.post(URL_API + KEY_GIVER_URL, body, {headers: headerGetKey});

    }

    TestKeyValid(hashKey: string) {
        let headerGetKey = new HttpHeaders({"Autorization": "Bearer " + hashKey});
        return this.http.get(URL_API, {headers: headerGetKey});
    }

    /*

    isFavorite(ad) {
        return this.getAllFavoriteAds().then(result => {
                if (result !== null) {
                    for (let favAd of result) {
                        if (favAd !== undefined && favAd.url !== undefined && favAd.url.toString() === ad.url.toString())
                            return true;
                    }
                }
                return false;
            }
        );
    }

    favoriteAd(ad) {
        return this.getAllFavoriteAds().then(result => {
            if (result) {
                result.push(ad);
                return this.storage.set(API_KEY, result);
            } else {
                return this.storage.set(API_KEY, [ad]);
            }
        });
    }

    unfavoriteAd(ad) {
        return this.getAllFavoriteAds().then(result => {
            if (result) {
                var index = result.indexOf(ad);
                result.splice(index, 1);
                return this.storage.set(API_KEY, result);
            }
        });
    }

    getAllFavoriteAds() {
        return this.storage.get(API_KEY);
    }*/
}