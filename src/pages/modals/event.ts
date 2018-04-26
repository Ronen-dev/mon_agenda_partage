import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Event } from "../../shared/models/event";
import { EventService } from "../../services/event.service";
import { FoyerPage } from "../foyer/foyer";

@Component({
    selector: 'page-modal-foyer',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>{{ show && mode === 'add' ? 'Ajouter' : 'Modifier'}} un événement</ion-title>
                <ion-buttons end>
                    <button ion-button icon-only (click)="dismiss()">
                        <ion-icon item-right name="ios-close-outline"></ion-icon>
                    </button>
                </ion-buttons>
            </ion-navbar>
        </ion-header>
        <ion-content>
            <form *ngIf="show" (ngSubmit)="submit()">
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
                    <button ion-button type="submit">{{ show && mode === 'add' ? 'Ajouter' : 'Modifier'}}</button>
                </div>
            </form>
            <ion-fab *ngIf="show && mode === 'edit'" right bottom>
                <button ion-fab color="danger" (click)="remove()"><ion-icon name="trash"></ion-icon></button>
            </ion-fab>
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
        private navCtrl: NavController
    ) {
        this.event = { } as Event;
        this.mode  = params.get('mode');
        this.init();
    }

    init() {
        this.event.allDay = false;
        this.storage.get('currentUser').then(user => {
            delete user.password;
            this.event.user = user;
            if (this.mode === 'edit') {
                this.event = this.params.get('event');
                let e = [];
                this.eventService.list().subscribe(events => {
                    e = events;
                    this.event = e.find(event => event.key === this.event.key);
                    this.show = true
                });
            } else {
                this.show = true;
            }
        });
    }

    submit() {
        if (this.mode === 'add') {
            let fireEvent = this.eventService.fireList();
            fireEvent.push(this.event).then(res => {
                this.dismiss(true);
            });
        } else {
            let fireEvents = this.eventService.fireList();
            fireEvents.update(this.event.key, this.event).then(res => {
                this.dismiss(true);
            });
        }
    }

    remove() {
        let fireEvents = this.eventService.fireList();
        fireEvents.remove(this.event.key).then(res => {
            this.dismiss(true);
            this.navCtrl.setRoot(FoyerPage);
        });
    }

    dismiss(isValid: boolean) {
        this.viewCtrl.dismiss({ valid: isValid });
    }
}
