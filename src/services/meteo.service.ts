import { Injectable } from '@angular/core';
import { Meteo } from "../models/meteo.model";
import { Http } from "@angular/http";

@Injectable()
export class MeteoService {

    apiKey: string = 'e6ac11530046888af06bffab02a46aae';
    url: string = 'https://api.openweathermap.org/data/2.5/weather?APPID=' + this.apiKey;

    constructor(
        private http: Http
    ) { }

    getMeteo(lat: string, lon: string): Promise<Meteo> {
        return this.http.get(this.url + '&lat=' + lat + '&lon=' + lon)
            .toPromise()
            .then(response => response.json() as Meteo);
    }
}
