import {Component, Input} from '@angular/core';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import {CodePostauxProvider} from "../../providers/codePostaux/codePostaux";
import {MapSelectorComponent} from "../../pages/mapSelector/mapSelector-component";
import {ModalController} from 'ionic-angular';

/**
 * Generated class for the ResearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'smallCodePostaux',
    templateUrl: 'smallCodePostaux.html'
})
export class SmallCodePostauxComponent {
    @Input() Info: PreferencesProvider;
    @Input() codePostaux: CodePostauxProvider;
    constructor(public modalCtrl: ModalController) {
                this.postalCodeVisible = false;
                this.arrowPostalCode = "arrow-dropdown-circle";
    }
    selectedPostalCode: string;
    postalCodeVisible: boolean;
    arrowPostalCode : string;
    items: Array<{nom: string, cp: number}>;
    delete(i: number) {
        console.log(this.codePostaux.codePostaux);
        delete this.Info.codePostal[i];
        this.initializeItems();
    }

    onInput(cp, item)
    {
        this.Info.codePostal.push(+cp);
        delete this.items[this.items.indexOf(item)];
    }

    initializeItems() {
        this.items = Object.assign([],  this.codePostaux.codePostaux);
        for(let cp of this.Info.codePostal)
        {
            for (let i = 0; i < this.items.length ; i++) {
                let item = this.items[i];
                if (item != undefined && item.cp == cp) {
                    delete this.items[i];
                }
            }
        }
    }
    checkFocus()
    {
        if (!this.postalCodeVisible)
            this.setpostalCodeVisible(!this.postalCodeVisible);
    }
    onResearchMap(){
       let mapModal= this.modalCtrl.create(MapSelectorComponent, { Info: this.Info } );
        mapModal.present();
    }
    showSelection()
    {
        this.setpostalCodeVisible(!this.postalCodeVisible);
    }
    setpostalCodeVisible(visi: boolean)
    {
        if (visi)
            this.arrowPostalCode = "arrow-dropup-circle";
        else
            this.arrowPostalCode = "arrow-dropdown-circle";
        this.postalCodeVisible = visi;
    }

    getItems(ev: any) {
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.cp.toString().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
    onCancel(e)
    {

    }
    ngOnInit() {
        this.initializeItems();
    }
}
