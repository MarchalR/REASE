import {Component, Input} from '@angular/core';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";

/**
 * Generated class for the ResearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'researchLocation',
    templateUrl: 'researchLocation.html'
})
export class ResearchLocationComponent {
    @Input() locationInfo: PreferencesProvider;
    @Input() codePostaux: CodePostauxProvider;


    constructor() {

    }

    ionViewWillEnter() {
        this.locationInfo.modalite = "location";
    }
}
