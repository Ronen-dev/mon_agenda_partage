import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { Foyer } from "../../shared/models/foyer";
import { FoyerService } from "../../services/foyer.service";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'page-modal-foyer',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>{{ show && mode === 'add' ? 'Ajouter un foyer' : 'Modifier le foyer' }}</ion-title>
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
                    <ion-label floating>Nom du foyer</ion-label>
                    <ion-input type="text" [(ngModel)]="foyer.name" name="name"></ion-input>
                </ion-item>
                <div text-center margin-top="15px">
                    <button ion-button type="submit">{{ show && mode === 'add' ? 'Ajouter' : 'Modifier' }}</button>
                </div>
            </form>
        </ion-content>
    `
})
export class FoyerModal {

    mode: string;
    foyer: Foyer;
    show: boolean = false;

    constructor(
        public viewCtrl: ViewController,
        private foyerService: FoyerService,
        private storage: Storage,
        private params: NavParams,
    ) {
        this.foyer = { } as Foyer;
        this.mode  = params.get('mode');
        this.init();
    }

    init() {
        if (this.mode === 'add') {
            this.storage.get('currentUser').then(user => {
                delete user.password;
                this.foyer.createdBy = user;
                this.foyer.users = [user];
                this.show = true;
            });
        } else {
            this.foyer = this.params.get('foyer');
            this.show  = true;
        }
    }

    submit() {
        if (this.mode === 'add') {
            let foyerList = this.foyerService.fireList();
            foyerList.push(this.foyer).then(res => {
                this.dismiss(true);
            })
        } else {
            let fireFoyers = this.foyerService.fireList();
            fireFoyers.update(this.foyer.key, { name: this.foyer.name }).then(res => {
                this.dismiss(true);
            });
        }
    }

    dismiss(isValid: boolean) {
        this.viewCtrl.dismiss({ valid: isValid });
    }
}
