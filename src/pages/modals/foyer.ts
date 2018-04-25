import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";
import { Foyer } from "../../shared/models/foyer";
import { FoyerService } from "../../services/foyer.service";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'page-modal-foyer',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>Ajouter un foyer</ion-title>
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
                    <button ion-button type="submit">Ajouter le foyer</button>
                </div>
            </form>
        </ion-content>
    `
})
export class FoyerModal {

    foyer: Foyer;

    constructor(
        public viewCtrl: ViewController,
        private foyerService: FoyerService,
        private storage: Storage
    ) {
        this.foyer = { } as Foyer;
        this.storage.get('currentUser').then(user => {
            delete user.password;
            this.foyer.createdBy = user;
            this.foyer.users = [user];
        });
    }

    submit() {
        let foyerList = this.foyerService.fireList();
        foyerList.push(this.foyer).then(res => {
            this.dismiss(true);
        })
    }

    dismiss(isValid: boolean) {
        this.viewCtrl.dismiss({ valid: isValid });
    }
}
