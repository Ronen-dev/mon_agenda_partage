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
import { FoyerModal } from "../modals/foyer";
import { FoyerPage } from "../foyer/foyer";
import { UserService } from "../../services/user.service";
import { CalendarPage } from "../calendar/calendar";

@Component({
	selector: 'page-user',
	templateUrl: 'user.html'
})
export class UserPage {

    currentFoyer: Foyer;
    currentUser: User;

	users: User[];
	show: boolean = false;
	admin: boolean = false;
    loading: Loading;

	constructor(
		private foyerService: FoyerService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        private storage: Storage,
        private userService: UserService
    ) { }

	ionViewDidLoad() {
    	this.init();
	}

	init() {
        this.loading = this.loadingCtrl.create({ content: 'Récupération des données ...', duration: 10000 });
        this.loading.present();
        this.foyerService.list().subscribe(foyers => {
            this.currentFoyer = this.navParams.get('foyer');
            let foyer = foyers.find(foyer => foyer.key === this.currentFoyer.key);
            if (typeof foyer !== 'undefined') {
                this.users = foyer.users;
                this.loading.dismiss();
                this.show  = true;
                this.storage.get('currentUser').then(user => {
                    this.currentUser = user;
                    if (user) {
                        if (user.email === this.currentFoyer.createdBy.email) {
                            this.admin = true;
                        }
                    }
                });
            } else {
                this.loading.dismiss();
            }
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

    editFoyer() {
        this.show = false;
        let foyerModal = this.modalCtrl.create(FoyerModal, { mode: 'edit', foyer: this.currentFoyer });
        foyerModal.onDidDismiss(data => {
            this.init();
        });
        foyerModal.present();
    }

    leaveFoyer() {
        let fireFoyers = this.foyerService.fireList();
        let users = this.currentFoyer.users.filter(user => user.email !== this.currentUser.email);
        fireFoyers.update(this.currentFoyer.key, { users: users }).then(res => {
            this.navCtrl.setRoot(FoyerPage);
        });
    }

    calendar(user: User) {
        this.navCtrl.push(CalendarPage, { user: user });
    }
}
