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

@Component({
	selector: 'page-foyer',
	templateUrl: 'foyer.html'
})
export class FoyerPage {

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
            this.foyerService.list().subscribe(foyers => {
                this.foyers = foyers.filter(foyer => foyer.createdBy.email === res.email);
                this.loading.dismiss();
                this.show   = true;
            });
        });
    }

	createFoyer() {
	    this.show = false;
        let foyerModal = this.modalCtrl.create(FoyerModal);
        foyerModal.onDidDismiss(data => {
            if (data.valid) {
                this.init();
            }
        });
        foyerModal.present();
    }
}
