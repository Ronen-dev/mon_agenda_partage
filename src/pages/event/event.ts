import { Component } from '@angular/core';
import { NavController, NavParams, Loading, ModalController } from 'ionic-angular';
import { Event } from "../../shared/models/event";
import { User } from "../../shared/models/user";
import { Storage } from "@ionic/storage";
import { FoyerPage } from "../foyer/foyer";
import { EventService } from "../../services/event.service";
import { EventModal } from "../modals/event";
import { UserEventModal } from "../modals/user-event";

@Component({
	selector: 'page-event',
	template: `
        <ion-header>
            <ion-navbar color="agenda">
                <button ion-button menuToggle>
                    <ion-icon name="menu"></ion-icon>
                </button>
                <ion-title *ngIf="show">{{ currentEvent.title }}</ion-title>
            </ion-navbar>
        </ion-header>

        <ion-content padding>
            <ion-title text-center>Détail de l'événement</ion-title>
            <ion-card *ngIf="show">
                <ion-item>
                    <ion-icon name='calendar' item-start style="color: #d03e84"></ion-icon>
                    Début
                    <ion-badge item-end>{{ currentEvent.startTime | date:'dd/MM/yyyy HH:mm' }}</ion-badge>
                </ion-item>
                <ion-item>
                    <ion-icon name='calendar' item-start style="color: #d03e84"></ion-icon>
                    Fin
                    <ion-badge item-end>{{ currentEvent.endTime | date:'dd/MM/yyyy HH:mm' }}</ion-badge>
                </ion-item>
                <ion-item *ngIf="currentEvent.allDay">
                    <ion-icon name='sunny' item-start style="color: #d03e84"></ion-icon>
                    Toute la journée
                </ion-item>
                <ion-item>
                    <ion-icon name='eye' item-start style="color: #d03e84"></ion-icon>
                    Visible
                    <ion-badge item-end>{{ currentEvent.visible ? 'Oui' : 'Non' }}</ion-badge>
                </ion-item>
            </ion-card>
            <ion-title text-center>Liste des participants</ion-title>
            <span *ngIf="show && currentEvent.hasOwnProperty('users') && currentEvent.users.length === 0">Aucun participant rattaché à cette événement.</span>
            <ion-list *ngIf="show && currentEvent.users.length > 0">
                <ion-item-sliding *ngFor="let user of currentEvent.users">
                    <ion-item>
                        <h2>{{ user.email }}</h2>
                    </ion-item>
                    <ion-item-options *ngIf="admin && user.email !== currentUser.email" side="right">
                        <button (click)="deleteUser(user)" ion-button color="danger">
                            <ion-icon name="trash"></ion-icon>
                            Supprimer
                        </button>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>
            <ion-fab *ngIf="!admin" right bottom>
                <button ion-fab color="danger" (click)="leaveEvent()"><ion-icon name="exit"></ion-icon></button>
            </ion-fab>
            <ion-fab *ngIf="admin" right bottom>
                <button ion-fab color="primary" (click)="editEvent()"><ion-icon name="settings"></ion-icon></button>
            </ion-fab>
            <ion-fab *ngIf="admin" left bottom>
                <button ion-fab color="agenda" (click)="addUser()"><ion-icon name="person-add"></ion-icon></button>
            </ion-fab>
        </ion-content>
    `
})
export class EventPage {

    admin: boolean = false;
    currentUser: User;
    currentEvent: Event;
	show: boolean = false;
    loading: Loading;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: Storage,
		public eventService: EventService,
        public modalCtrl: ModalController
    ) { }

	ionViewDidLoad() {
        this.currentEvent = this.navParams.get('event');
        this.init();
	}

	init() {
        this.storage.get('currentUser').then(user => {
            this.currentUser = user;
            if (this.currentUser.email === this.currentEvent.user.email) {
                this.admin = true;
                this.show = true;
            } else {
                this.show = true;
            }
        });
    }

    editEvent() {
        let eventModal = this.modalCtrl.create(EventModal, { mode: 'edit', event: this.currentEvent });
        eventModal.onDidDismiss(data => {
            if (data.valid) {
                if (data.hasOwnProperty('event')) {
                    this.currentEvent = data.event;
                }
            }
            this.init();
        });
        eventModal.present();
    }

    addUser() {
        let userEventModal = this.modalCtrl.create(UserEventModal, { event: this.currentEvent });
        userEventModal.onDidDismiss(data => {
            if (data.valid) {
                this.currentEvent = data.event;
            }
            this.init();
        });
        userEventModal.present();
    }

    deleteUser(u: User) {
        let fireEvents = this.eventService.fireList();
        let users = this.currentEvent.users.filter(user => user.email !== u.email);
        fireEvents.update(this.currentEvent.key, { users: users }).then(() => {
            this.currentEvent.users = users;
            this.init();
        });
    }

    leaveEvent() {
        let fireEvents = this.eventService.fireList();
        let users = this.currentEvent.users.filter(user => user.email !== this.currentUser.email);
        fireEvents.update(this.currentEvent.key, { users: users }).then(() => {
            this.currentEvent.users = users;
            this.init();
        });
    }
}
