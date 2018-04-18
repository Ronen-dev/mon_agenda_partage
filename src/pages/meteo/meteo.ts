import { Component, OnInit } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { MeteoService } from '../../services/meteo.service';
import { Meteo } from '../../models/meteo.model';
import { Geolocation } from '@ionic-native/geolocation';

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
        private geolocation: Geolocation,
        private loadingCtrl: LoadingController,
        private meteoService: MeteoService,
    ) { }

    ngOnInit() {
        this.loading = this.loadingCtrl.create({ content: 'Récupération des données ...' });
        this.loading.present();
        this.geolocation.getCurrentPosition().then(res => {
            this.meteoService.getMeteo(res.coords.latitude, res.coords.longitude).then(meteo => {
                this.meteo = meteo;
                this.loading.dismiss();
                this.show = true;
            });
        }).catch((err) => {
            console.log('Error getting location', err);
            this.show = false;
            this.loading.dismiss();
        });
    }

}
