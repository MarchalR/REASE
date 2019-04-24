import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Result} from "../../classes/Result";
/*
  Generated class for the ResultProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const STORAGE_KEY = 'favoriteAds';

@Injectable()
export class FavoriteProvider {

    constructor(public storage: Storage) {
    }

    /*
    login(userName, password) {

    }
    register(userName, password) {

    }*/

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
                return this.storage.set(STORAGE_KEY, result);
            } else {
                return this.storage.set(STORAGE_KEY, [ad]);
            }
        });
    }

    unfavoriteAd(ad) {
        return this.getAllFavoriteAds().then(result => {
            if (result) {
                var index = result.indexOf(ad);
                result.splice(index, 1);
                return this.storage.set(STORAGE_KEY, result);
            }
        });
    }

    getAllFavoriteAds() {
        return this.storage.get(STORAGE_KEY);
    }
}
