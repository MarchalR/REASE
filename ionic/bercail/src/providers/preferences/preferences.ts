import {Injectable} from '@angular/core';

/*
  Generated class for the PreferencesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PreferencesProvider {
    modalite: string;
    type: string;
    supMax: number;
    supMin: number;
    prixMax: number;
    prixMin: number;
    codePostal: number[] = [];
    pieces: number;
    page: number = 1;

    constructor() {
    }
    //return the string behind the GetRequest


}
