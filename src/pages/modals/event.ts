import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { Foyer } from "../../shared/models/foyer";
import { FoyerService } from "../../services/foyer.service";
import { Storage } from "@ionic/storage";
import { Event } from "../../shared/models/event";
import { EventService } from "../../services/event.service";

@Component({
    selector: 'page-modal-foyer',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>Ajouter un événement</ion-title>
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
                    <ion-label floating>Titre de l'événement</ion-label>
                    <ion-input type="text" [(ngModel)]="event.title" name="title"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label>Toute la journée</ion-label>
                    <ion-toggle [(ngModel)]="event.allDay" name="allDay"></ion-toggle>
                </ion-item>
                <ion-item>
                    <ion-label>Date de début</ion-label>
                    <ion-datetime displayFormat="DD/MM/YYYY HH:mm" name="startTime" [(ngModel)]="event.startTime"></ion-datetime>
                </ion-item>
                <ion-item>
                    <ion-label>Date de fin</ion-label>
                    <ion-datetime displayFormat="DD/MM/YYYY HH:mm" name="endTime" [(ngModel)]="event.endTime"></ion-datetime>
                </ion-item>
                <ion-item>
                    <ion-label>Visible dans les foyers</ion-label>
                    <ion-toggle [(ngModel)]="event.visible" name="visible"></ion-toggle>
                </ion-item>
                <div text-center margin-top="15px">
                    <button ion-button type="submit">Ajouter</button>
                </div>
            </form>
            <pre>{{ event | json }}</pre>
        </ion-content>
    `
})
export class EventModal {

    mode: string;
    event: Event;
    show: boolean = false;

    constructor(
        public viewCtrl: ViewController,
        private eventService: EventService,
        private storage: Storage,
        private params: NavParams,
    ) {
        this.event = { } as Event;
        this.event.allDay = false;
        this.storage.get('currentUser').then(user => {
            delete user.password;
            this.event.user = user;
        });
        // this.mode  = params.get('mode');
        this.init();
    }

    init() {
        // if (this.mode === 'add') {
        //     this.storage.get('currentUser').then(user => {
        //         delete user.password;
        //         this.foyer.createdBy = user;
        //         this.foyer.users = [user];
        //         this.show = true;
        //     });
        // } else {
        //     this.foyer = this.params.get('foyer');
        //     this.show  = true;
        // }
    }

    submit() {
        // this.event.startTime = new Date(this.event.startTime);
        // this.event.endTime = new Date(this.event.endTime);

        let fireEvent = this.eventService.fireList();
        fireEvent.push(this.event).then(res => {
            this.dismiss(true);
        });
    }

    dismiss(isValid: boolean) {
        this.viewCtrl.dismiss({ valid: isValid });
    }
}
