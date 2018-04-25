import { Component } from '@angular/core';
import {
    NavController,
    NavParams,
    AlertController,
    ModalController,
    LoadingController,
    Loading
} from 'ionic-angular';
import { Foyer } from "../../shared/models/foyer";
import { FoyerService } from "../../services/foyer.service";
import { FoyerModal } from "../modals/foyer";
import { Storage } from "@ionic/storage";
import { User } from "../../shared/models/user";

@Component({
	selector: 'page-user',
	templateUrl: 'user.html'
})
export class UserPage {

    currentFoyer: Foyer;

	users: User[];
	show: boolean = false;
    loading: Loading;

	constructor(
		private foyerService: FoyerService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        private storage: Storage
    ) { }

	ionViewDidLoad() {
    	this.init();
	}

	init() {
        this.loading = this.loadingCtrl.create({ content: 'Récupération des données ...', duration: 10000 });
        this.loading.present();
        this.foyerService.list().subscribe(foyers => {
            this.currentFoyer = this.navParams.get('foyer');
            let foyer  = foyers.find(foyer => foyer.key === this.currentFoyer.key);
            this.users = foyer.users;
            this.loading.dismiss();
            this.show   = true;
        });
    }

    detail(user: User) { }
}
