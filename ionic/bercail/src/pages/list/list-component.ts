import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DetailComponent} from '../detail/detail-component';
import 'rxjs/add/operator/map';
import {HomeComponent} from '../home/home-component';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {FavoriteProvider} from "../../providers/Favorites/User";
import {ApiProvider} from "../../providers/Api/apiProvider";

@Component({
    selector: 'list-component',
    templateUrl: 'list-component.html'
})
export class ListComponent {

    tabAds = [];
    pages: string = "app";
    pagination = "";
    totalItems: any;
    requestParam: string = "";
    form: any;
    sort: any = 0;
    homeComponent: any;
    currentPage = 1;
    price: number = 0;
    surface: number = 1;
    nbRoom: number = 2;
    research: boolean = true;
    arrowOrder: string = "arrow-dropup-circle";
    order: boolean = true;

    constructor(
        public navCtrl: NavController,
        public favoriteProvider: FavoriteProvider,
        private preferences: PreferencesProvider,
        private apiService: ApiProvider) {
        this.homeComponent = HomeComponent;
        //Definition of the resquest params
        this.getRequest()
    }

    getRequest() {
        let result: string = "";
        for (let codePostal of this.preferences.codePostal) {
            if (codePostal !== undefined)
                result += "postalCode[]=" + codePostal + "&"
        }
        if (this.preferences.supMax != undefined)
            result += "surface[lte]=" + this.preferences.supMax + "&";
        if (this.preferences.supMin != undefined)
            result += "surface[gte]=" + this.preferences.supMin + "&";
        if (this.preferences.prixMax != undefined)
            result += "price[lte]=" + this.preferences.prixMax + "&";
        if (this.preferences.prixMin != undefined)
            result += "price[gte]=" + this.preferences.prixMin! + "&";
        //dans le cas ou on ne rentre pas de prix min on met un prix de 100
        else{
            result += "price[gte]=100&"
        }
        if (this.preferences.pieces != undefined)
            result += "nbRoom=" + this.preferences.pieces + "&";
        switch (this.sort) {
            case this.price : {
                result += "order[price]=";
                break;
            }
            case this.surface : {
                result += "order[surface]=";
                break;
            }
        }
        result += this.order ? "asc&" : "desc&"
        this.requestParam = '?' + result;
    }

    ionViewDidLoad() {
        this.reload();
    }

    showFav() {
        this.currentPage = 1;
        this.research = false;
        this.reload()
    }

    loadFav() {
        this.favoriteProvider.getAllFavoriteAds().then((results) => {
            if (results != null && results != undefined) {
                this.tabAds = results.slice((this.currentPage - 1) * 10, (this.currentPage) * 10);
                this.totalItems = results.length;
            }
        });
    }

    showResearch() {
        this.currentPage = 1;
        this.research = true;
        this.reload()
    }

    loadResearch() {
        // Construct URL
        let url = "https://api.rease.fr/api/super_annonces";
        let completeUrl = url + (this.requestParam + "page=" + this.currentPage);
        console.log(completeUrl);
        // Call to API

        this.apiService.getAllObjets(completeUrl).subscribe(ads_data => {
                // Fetch ads
                this.tabAds = [];
                ads_data['hydra:member'].forEach(function (ad) {
                    if (!ad.price)
                        ad.price = '?';
                    for (let annonce of ad.annonce) {
                        if (annonce.site.name.includes("Le Bon Coin")) {
                            ad.leboncoin = true;
                        } else if (annonce.site.name.includes("Se Loger")) {
                            ad.seloger = true;
                        } else if (annonce.site.name.includes("Logic Immo")) {
                            ad.logicimmo = true;
                        }
                    }
                    if (ad.image) {
                        let images =[];
                        for (let image of ad.image) {
                            if (image != null) {
                                images.push(image);
                            }
                        }
                        ad.image = images.slice();
                    }
                    this.tabAds.push(ad);
                    if (ad.title.toUpperCase().includes("MAISON")) {
                        ad.typeL = "Maison"
                    } else if (ad.title.toUpperCase().includes("PARKING")) {
                        ad.typeL = "Parking"
                    } else if (ad.title.toUpperCase().includes("APPARTEMENT")) {
                        ad.typeL = "Appartement"
                    } else {
                        ad.typeL = "Logement"
                    }
                    this.favoriteProvider.isFavorite(ad).then(isFav => {
                        ad.isFavorite = isFav;
                    })
                }, this);
                // Save data to be displayed
                this.totalItems = ads_data['hydra:totalItems'];
                this.pagination = ads_data['hydra:view'];
                this.orderBy();
            });
    }

    reload() {
        if (this.research) {
            this.getRequest();
            this.loadResearch();
        } else
            this.loadFav();
        this.totalItems = 'Nous recherchons vos ';
        this.orderBy();
    }

    previousAds() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.reload();
        }
    }

    favoriteAd(ad: any) {
        ad.isFavorite = true;
        this.favoriteProvider.favoriteAd(ad);
    }

    unfavoriteAd(ad: any) {
        ad.isFavorite = false;
        this.favoriteProvider.unfavoriteAd(ad);
    }

    nextAds() {
        if (this.currentPage < 10) {
            this.currentPage += 1;
            this.reload();
        }
    }

    goBack() {
        var r = this.navCtrl.getViews();
        //pop all stack of ListComponent.
        for (let s of r) {
            var st = s.component.name;
            if (st == 'ListComponent') {
                this.navCtrl.pop();
            }
        }
    }

    itemTapped(event, data) {
        this.navCtrl.push(DetailComponent, {
            data: data
        });
    }

    changeOrder() {
        this.order = !this.order;
        if (this.order)
            this.arrowOrder = "arrow-dropup-circle";
        else
            this.arrowOrder = "arrow-dropdown-circle";
        this.reload();
    }

    orderBy() {
        switch (this.sort) {
            case this.price : {
                this.tabAds = this.tabAds.sort((res1, res2) => this.order ? res1.price - res2.price : -res1.price + res2.price);
                break;
            }
            case this.surface : {
                this.tabAds = this.tabAds.sort((res1, res2) => this.order ? res1.surface - res2.surface : -res1.surface + res2.surface);
                break;
            }
            case this.nbRoom : {
                this.tabAds = this.tabAds.sort((res1, res2) => this.order ? res1.nbRoom - res2.nbRoom : -res1.nbRoom + res2.nbRoom);
                break;
            }
        }
    }
}
