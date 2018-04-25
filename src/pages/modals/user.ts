import { Component } from "@angular/core";
import { AlertController, NavParams, ViewController } from "ionic-angular";
import { Foyer } from "../../shared/models/foyer";
import { FoyerService } from "../../services/foyer.service";
import { Storage } from "@ionic/storage";
import { User } from "../../shared/models/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'page-modal-foyer',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>Ajouter un utilisateur</ion-title>
                <ion-buttons end>
                    <button ion-button icon-only (click)="dismiss()">
                        <ion-icon item-right name="ios-close-outline"></ion-icon>
                    </button>
                </ion-buttons>
            </ion-navbar>
        </ion-header>
        <ion-content>
            <form (ngSubmit)="submit()">
                <ion-item>
                    <ion-label floating>Adresse e-mail</ion-label>
                    <ion-input type="text" [(ngModel)]="user.email" name="email"></ion-input>
                </ion-item>
                <div text-center margin-top="15px">
                    <button ion-button type="submit">Ajouter le contact</button>
                </div>
            </form>
        </ion-content>
    `
})
export class UserModal {

    user: User;
    currentFoyer: Foyer;

    constructor(
        public viewCtrl: ViewController,
        private foyerService: FoyerService,
        private userService: UserService,
        private storage: Storage,
        private params: NavParams,
        private alertCtrl: AlertController
    ) {
        this.user = { } as User;
        this.currentFoyer = params.get('foyer');
    }

    submit() {
        this.userService.list().subscribe(users => {
            let foundUser = users.find(user => user.email === this.user.email);
            if (typeof foundUser !== 'undefined') {
                let foundUserInFoyer = this.currentFoyer.users.find(user => user.email === this.user.email);
                if (typeof foundUserInFoyer === 'undefined') {
                    let newUsers = this.currentFoyer.users;
                    newUsers.push({ email: this.user.email });
                    let fireFoyers = this.foyerService.fireList();
                    fireFoyers.update(this.currentFoyer.key, { users: newUsers }).then(res => {
                        this.dismiss(true);
                    });
                } else {
                    let alert = this.alertCtrl.create({
                        title: 'E-mail déjà renseigné',
                        subTitle: 'L\'utilisateur choisi fait déjà parti de ce foyer.',
                        buttons: ['D\'accord']
                    });
                    alert.present();
                }
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Mauvais e-mail',
                    subTitle: 'L\'utilisateur renseigné n\'est pas inscrit.',
                    buttons: ['D\'accord']
                });
                alert.present();
            }
        });
    }

    dismiss(isValid: boolean) {
        this.viewCtrl.dismiss({ valid: isValid });
    }
}
