import { Component, OnInit } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { MeteoService } from "../../services/meteo.service";
import { Meteo } from "../../models/meteo.model";

@Component({
    selector: 'page-meteo',
    templateUrl: 'meteo.html'
})
export class MeteoPage implements OnInit {

    meteo: Meteo;
    show: boolean = false;
    kelvinDiff: number = 273.15;
    loading: Loading;

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private meteoService: MeteoService,
    ) { }

    ngOnInit() {
        this.loading = this.loadingCtrl.create({ content: 'Récupération des données ...' });
        this.loading.present();
        this.meteoService.getMeteo('34', '56').then(meteo => {
            console.log(meteo);
            this.meteo = meteo;
            this.loading.dismiss();
            this.show = true;
        });
    }

}
