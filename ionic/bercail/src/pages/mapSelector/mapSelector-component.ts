import {Component, ViewChild, ElementRef} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {HomeComponent} from '../home/home-component';
import {NavParams} from 'ionic-angular';
import {PreferencesProvider} from "../../providers/preferences/preferences";
import leaflet from 'leaflet';
import {Http} from "@angular/http";

@Component({
    selector: 'mapSelector-component',
    templateUrl: 'mapSelector-component.html'
})

export class MapSelectorComponent {
    @ViewChild('map') mapContainer: ElementRef;
    map: any;
    homeComponent: any;
    myLayer: any;
    features: any[];
    Info: PreferencesProvider;
    constructor(public viewCtrl: ViewController, params: NavParams, public http: Http) {
        this.homeComponent = HomeComponent;
        this.features = new Array<any>();
        this.Info = params.get('Info');
    }

    onResearch(){
    }

    ionViewDidEnter() {
        this.loadmap();
    }
    //crée le style des arrondissement au chargement de la map
    //soit le code postal n est pas enregistrer et il est initialisé normalement
    //soit le code postal existe et doit est illuminé
    style(feature) {
        let i = this.Info.codePostal.indexOf(+feature.properties.postal_code);
        if (i == -1)
        return {
            fillColor: '#fdbb84',
            weight: 2,
            opacity: 0.6,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
        else
            return {
                fillColor: '#58b6cc',
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.7,
                color: 'white',
                dashArray: '3'
            };
    }
    //met en surbrillance un arrondissement
    highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            fillColor: '#58b6cc',
            opacity: 0.6,
            fillOpacity: 0.7
        });
    }
    // reset le style d'un arrondissement
    resetFeatureStyle(e) {
        var layer = e.target;
        layer.setStyle({
            fillColor: '#fdbb84',
            weight: 2,
            opacity: 0.6,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        });
    }
/*
 * fonction appeler lorsque qu'on clique sur un arrondissement
 * Param :  un event contenant la taget de l'event
 *
 * Return void
 */
    onClickFeature(e) {
        let j = this.Info.codePostal.indexOf(+e.target.feature.properties.postal_code);
        let i = this.features.indexOf(e.target);
        if (j == -1)
        {
            this.features.push(e.target);
            //this.map.fitBounds(e.target.getBounds());
            this.highlightFeature(e);
            this.Info.codePostal.push(+e.target.feature.properties.postal_code);
        }
        else
        {
            delete this.Info.codePostal[this.Info.codePostal.indexOf(+e.target.feature.properties.postal_code)];
            this.resetFeatureStyle(e);
            if (i != -1)
            {
                delete this.features[i];
            }
        }
    }
    /*
     * Pour chaque feature on lui donne la fonction à appleer pour chaque evenement
     */
    onEachFeature(feature, layer){
        let that = this;
        layer.on({
            click: this.onClickFeature.bind(that)
        });
    }
    /*
     * au chargement de la page, on intialise la map avec les données déjà rempli ou non
     */
    loadmap() {
        this.map = leaflet.map("map").setView([48.8626304851685, 2.3362934465505396], 11);
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.map);
        // on charge le fichier json contenant les arrondissements
        this.http.get('assets/mapData.geojson').map(res => res.json()).subscribe(data => {
            this.myLayer = leaflet.geoJSON(data,
                {
                    style: this.style.bind(this),
                    onEachFeature: this.onEachFeature.bind(this)
                }).addTo(this.map);
        });
    }



    goBack() {
        this.viewCtrl.dismiss();
    }
}