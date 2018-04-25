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
import { Storage } from "@ionic/storage";
import { User } from "../../shared/models/user";
import { UserModal } from "../modals/user";

@Component({
	selector: 'page-user',
	templateUrl: 'user.html'
})
export class UserPage {

    currentFoyer: Foyer;
    currentUser: User;

	users: User[];
	show: boolean = false;
	showEdit: boolean = false;
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
            this.show  = true;
            this.storage.get('currentUser').then(user => {
                if (user) {
                    if (user.email === this.currentFoyer.createdBy.email) {
                        this.showEdit = true;
                    }
                }
            });
        });
    }

    addUser() {
        this.show = false;
        let userModal = this.modalCtrl.create(UserModal, { foyer: this.currentFoyer });
        userModal.onDidDismiss(data => {
            this.init();
        });
        userModal.present();
    }

    editFoyer() {}

    // detail(user: User) { }
}
