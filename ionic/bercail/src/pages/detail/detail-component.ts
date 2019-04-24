import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Result} from "../../classes/Result";
import {FavoriteProvider} from "../../providers/Favorites/User";

@Component({
    selector: 'detail-component',
    templateUrl: 'detail-component.html'
})
export class DetailComponent {

    selectedItem: Result;
    private isFavorite = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: FavoriteProvider) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('data');
        this.userProvider.isFavorite(this.selectedItem).then(isFav => {
            this.isFavorite = isFav;
        });
    }

    favoriteAd() {
        this.isFavorite = true;
        this.selectedItem.isFavorite = true;
        this.userProvider.favoriteAd(this.selectedItem);
    }

    unfavoriteAd() {
        this.isFavorite = false;
        this.selectedItem.isFavorite = false;
        this.userProvider.unfavoriteAd(this.selectedItem);
    }


    goBack() {
        this.navCtrl.pop();
    }
}
