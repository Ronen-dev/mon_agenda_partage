export class Meteo {

    public id: string;
    public coord?: {
        lon: string,
        lat: string
    };
    public weather?: [{
        id: string,
        main: string,
        description: string,
        icon: string
    }];
    public base?: string;
    public main?: {
        temp: string,
        pressure: string,
        humidity: string,
        temp_min: string,
        temp_max: string,
        sea_level: string,
        grnd_level: string
    };
    public wind?: {
        speed: string,
        deg: string
    };
    public rain?: {
        '3h': string
    };
    public clouds?: {
        all: string
    };
    public dt?: string;
    public sys?: {
        message: string,
        country: string,
        sunrise: string,
        sunset: string
    };
    public name?: string;
    public cod?: number;

    constructor(object: any) {
        Object.assign(this, object);
    }

}
