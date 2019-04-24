import {Component} from '@angular/core';
import {ChoiceComponent} from "../choice/choice-component";
import {NavController} from "ionic-angular";
import {AuthComponent} from "../auth/auth-component";
import {RegisterComponent} from "../register/register-component";

@Component({
    selector: 'home-component',
    templateUrl: 'home-component.html'
})
export class HomeComponent {

    homeComponent: any;
    choiceComponent: any;
    authComponent: any;
    registerComponent: any;


    constructor() {
        this.homeComponent = HomeComponent;
        this.choiceComponent = ChoiceComponent;
        this.authComponent = AuthComponent;
        this.registerComponent = RegisterComponent;
    }
}
