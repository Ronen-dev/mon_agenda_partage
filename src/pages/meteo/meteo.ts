import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MeteoService } from "../../services/meteo.service";
import { Meteo } from "../../models/meteo.model";

@Component({
    selector: 'page-meteo',
    templateUrl: 'meteo.html'
})
export class MeteoPage implements OnInit {

    meteo: Meteo;
    show: boolean = false;

    constructor(
        public navCtrl: NavController,
        private meteoService: MeteoService
    ) { }

    ngOnInit() {
        this.meteoService.getMeteo('34', '56').then(meteo => {
            this.meteo = meteo;
            this.show  = true;
        });
    }

}
