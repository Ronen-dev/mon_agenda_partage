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
import { UserPage } from "../user/user";
import { User } from "../../shared/models/user";

@Component({
	selector: 'page-foyer',
	templateUrl: 'foyer.html'
})
export class FoyerPage {

    currentUser: User;
	foyers: Foyer[];
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
	    this.storage.get('currentUser').then(res => {
	        this.currentUser = res;
            this.foyerService.list().subscribe(foyers => {
                this.foyers = foyers.filter(foyer => this._findUser(foyer.users, this.currentUser.email));
                this.loading.dismiss();
                this.show   = true;
            });
        });
    }

    detail(foyer: Foyer) {
	    this.navCtrl.push(UserPage, { foyer: foyer });
    }

	createFoyer() {
	    this.show = false;
        let foyerModal = this.modalCtrl.create(FoyerModal);
        foyerModal.onDidDismiss(data => {
            this.init();
        });
        foyerModal.present();
    }

    _findUser(users: User[], email: string) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                return true;
            }
        }
        return false;
    }
}
