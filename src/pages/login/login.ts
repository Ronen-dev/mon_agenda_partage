import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../shared/models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from "../home/home";
import { Storage } from "@ionic/storage";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user: User;
    currentUser: User;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private afAuth: AngularFireAuth,
        private alertCtrl: AlertController,
        private storage: Storage,
        private userService: UserService
    ) {
        this.user = {} as User;
    }

    ionViewDidLoad() { }

    login(user: User) {
        if (Object.keys(user).length !== 0 && user.constructor === Object) {
            this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(result => {
                this.storage.set('currentUser', user);
                this.navCtrl.setRoot(HomePage);
            }).catch(err => {
                let alert = this.alertCtrl.create({
                    title: 'Identifiants incorrects !',
                    subTitle: 'Veuillez vérifier vos identifiants de connexion.',
                    buttons: ['D\'accord']
                });
                alert.present();
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Champs vide',
                subTitle: 'Veuillez ajouter un e-mail et un mot de passe.',
                buttons: ['D\'accord']
            });
            alert.present();
        }
    }

    register(user: User) {
        if (Object.keys(user).length !== 0 && user.constructor === Object) {
            this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(result => {
                let userList = this.userService.fireList();
                delete user.password;
                userList.push(user).then(res => {
                    this.storage.set('currentUser', user);
                    this.navCtrl.setRoot(HomePage);
                });
            }).catch(err => {
                let subtitle = 'Une erreur est survenue lors de l\'inscription.';
                if (err.code === 'auth/email-already-in-use') {
                    subtitle = 'L\'e-mail renseigné existe déjà.';
                }
                let alert = this.alertCtrl.create({
                    title: 'Erreur',
                    subTitle: subtitle,
                    buttons: ['D\'accord']
                });
                alert.present();
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Champs vide',
                subTitle: 'Veuillez ajouter un e-mail et un mot de passe.',
                buttons: ['D\'accord']
            });
            alert.present();
        }
    }
}
