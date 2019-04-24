import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HttpModule} from '@angular/http';

import {HomeComponent} from '../pages/home/home-component';
import {ChoiceComponent} from '../pages/choice/choice-component';
import {BuyComponent} from '../pages/buy/buy-component';
import {RentComponent} from '../pages/rent/rent-component';
import {DetailComponent} from '../pages/detail/detail-component';
import {ListComponent} from '../pages/list/list-component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ResultsProvider} from '../providers/Results/Results';
import {PreferencesProvider} from '../providers/preferences/preferences';
import {ResearchLocationComponent} from '../components/researchLocation/researchLocation';
import {ResearchAchatComponent} from '../components/researchAchat/researchAchat';
import {MapSelectorComponent} from "../pages/mapSelector/mapSelector-component";
import {CodePostauxProvider} from "../providers/codePostaux/codePostaux";
import {CodePostauxComponent} from "../components/codePostaux/codePostaux";
import {AuthComponent} from "../pages/auth/auth-component";
import {RegisterComponent} from "../pages/register/register-component";
import {HelpedBuyComponent} from "../pages/helpedBuy/helped-buy-component";
import {QuestionService} from "../providers/questions/question.service";
import { IonicStorageModule } from '@ionic/storage';
import {QuestionControlService} from "../providers/questions/question-control.service";
import {FormQuestionComponent} from "../pages/helpedBuy/form-question.component";
import {SmallCodePostauxComponent} from "../components/smallCodePostaux/smallCodePostaux";
import {FavoriteProvider} from "../providers/Favorites/User";
import {ApiProvider} from "../providers/Api/apiProvider";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        MyApp,
        HomeComponent,
        ChoiceComponent,
        BuyComponent,
        RentComponent,
        AuthComponent,
        CodePostauxComponent,
        SmallCodePostauxComponent,
        ListComponent,
        DetailComponent,
        HelpedBuyComponent,
        RegisterComponent,
        MapSelectorComponent,
        ResearchLocationComponent,
        ResearchAchatComponent,
        FormQuestionComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        HttpClientModule,
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomeComponent,
        CodePostauxComponent,
        SmallCodePostauxComponent,
        ChoiceComponent,
        BuyComponent,
        AuthComponent,
        RentComponent,
        HelpedBuyComponent,
        ListComponent,
        MapSelectorComponent,
        DetailComponent,
        RegisterComponent,
        ResearchLocationComponent,
        ResearchAchatComponent,
        FormQuestionComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ResultsProvider,
        CodePostauxProvider,
        PreferencesProvider,
        ApiProvider,
        FavoriteProvider,
        QuestionControlService,
        QuestionService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    ]
})
export class AppModule {
}
