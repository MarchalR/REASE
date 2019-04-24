import {OnInit, Component} from '@angular/core';
import {ListComponent} from '../list/list-component';
import {NavController, NavParams} from 'ionic-angular';
import {HomeComponent} from '../home/home-component';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";

@Component({
    selector: 'buy-component',
    templateUrl: 'buy-component.html'
})
export class BuyComponent {

    homeComponent: any;

    constructor(public navCtrl: NavController,
                public achatInfo: PreferencesProvider,
                public codePostaux: CodePostauxProvider) {
        this.homeComponent = HomeComponent;
    }
    onResearch(){
        this.navCtrl.push(ListComponent, {});
    }

    goBack() {
        this.navCtrl.pop();
    }
}
