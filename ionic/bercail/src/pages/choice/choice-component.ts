import {Component, ViewChild} from '@angular/core';
import {NavController} from "ionic-angular";
import {BuyComponent} from "../buy/buy-component";
import {RentComponent} from "../rent/rent-component";
import {AuthComponent} from "../auth/auth-component";
import {HelpedBuyComponent} from "../helpedBuy/helped-buy-component";

@Component({
    selector: 'choice-component',
    templateUrl: 'choice-component.html'
})
export class ChoiceComponent {

    choiceComponent: any;
    buyComponent: any;
    helpedBuyComponent: any;
    rentComponent: any;
    authComponent: any;

    constructor(public navCtrl: NavController) {
        this.choiceComponent = ChoiceComponent;
        this.buyComponent = BuyComponent;
        this.helpedBuyComponent = HelpedBuyComponent;
        this.rentComponent = RentComponent;
    }

    goBack() {
        this.navCtrl.pop();
    }

}
