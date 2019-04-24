import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav} from 'ionic-angular';
import {HomeComponent} from '../pages/home/home-component';
import {BuyComponent} from '../pages/buy/buy-component';
import {RentComponent} from '../pages/rent/rent-component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {PreferencesProvider} from "../providers/preferences/preferences";
import {ListComponent} from "../pages/list/list-component";
import {CodePostauxProvider} from "../providers/codePostaux/codePostaux";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HomeComponent the root (or first) page
    rootPage = HomeComponent;
    pages: Array<{ title: string, component: any }>;
    recherche: string = "achat";


    constructor(public platform: Platform,
                public menu: MenuController,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public locationInfo: PreferencesProvider,
                public achatInfo: PreferencesProvider,
                private ref: ChangeDetectorRef,
                public codePostaux: CodePostauxProvider) {

        this.initializeApp();
        // set our app's pages
        this.pages = [
            {title: 'Accueil', component: HomeComponent},
            {title: 'Achat', component: BuyComponent},
            {title: 'Location', component: RentComponent},
        ];
    }


    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }

    onResearch() {
        this.menu.close();
        this.nav.push(ListComponent, {});
    }
}
