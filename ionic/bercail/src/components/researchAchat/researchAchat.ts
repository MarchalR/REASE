import {Component, Input} from '@angular/core';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";
import {MapSelectorComponent} from "../../pages/mapSelector/mapSelector-component";

/**
 * Generated class for the ResearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'researchAchat',
    templateUrl: 'researchAchat.html'
})
export class ResearchAchatComponent {
    @Input() achatInfo: PreferencesProvider;
    @Input() codePostaux: CodePostauxProvider;

    constructor() {
    }
}
