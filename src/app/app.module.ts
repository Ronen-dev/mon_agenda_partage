import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MeteoPage } from '../pages/meteo/meteo';
import { MeteoService } from '../services/meteo.service';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        MeteoPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        MeteoPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        MeteoService,
        Geolocation
    ]
})
export class AppModule {}
