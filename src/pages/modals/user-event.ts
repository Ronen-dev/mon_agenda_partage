import { Component } from "@angular/core";
import { AlertController, NavParams, ViewController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { User } from "../../shared/models/user";
import { UserService } from "../../services/user.service";
import { Event } from "../../shared/models/event";
import { EventService } from "../../services/event.service";

@Component({
    selector: 'page-modal-user-event',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>Ajouter un participant à l'événement</ion-title>
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
                    <button ion-button type="submit">Ajouter le participant</button>
                </div>
            </form>
        </ion-content>
    `
})
export class UserEventModal {

    currentEvent: Event;
    user: User;

    constructor(
        public viewCtrl: ViewController,
        private eventService: EventService,
        private userService: UserService,
        private storage: Storage,
        private params: NavParams,
        private alertCtrl: AlertController
    ) {
        this.currentEvent = { } as Event;
        this.user         = { } as User;
        this.currentEvent = params.get('event');
    }

    submit() {
        this.userService.list().subscribe(users => {
            let foundUser = users.find(user => user.email === this.user.email);
            if (typeof foundUser !== 'undefined') {
                let foundUserInEvent = this.currentEvent.users.find(user => user.email === this.user.email);
                if (typeof foundUserInEvent === 'undefined') {
                    let newUsers = this.currentEvent.users;
                    newUsers.push({ email: this.user.email });
                    let fireEvents = this.eventService.fireList();
                    fireEvents.update(this.currentEvent.key, { users: newUsers }).then(res => {
                        this.currentEvent.users = newUsers;
                        this.dismiss(true, this.currentEvent);
                    });
                } else {
                    let alert = this.alertCtrl.create({
                        title: 'E-mail déjà renseigné',
                        subTitle: 'L\'utilisateur choisi fait déjà parti de cette événement.',
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

    dismiss(isValid: boolean, event?: Event) {
        let data = { valid: isValid };
        if (event) {
            data['event'] = event;
        }
        this.viewCtrl.dismiss(data);
    }
}
