import {OnInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ListComponent} from '../list/list-component';
import {NavController, NavParams} from 'ionic-angular';
import {HomeComponent} from '../home/home-component';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";

@Component({
    selector: 'rent-component',
    templateUrl: 'rent-component.html'
})
export class RentComponent {

    homeComponent: any;

    constructor(public navCtrl: NavController,
                public locationInfo: PreferencesProvider,
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
