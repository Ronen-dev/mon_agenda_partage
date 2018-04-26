import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EventModal } from "../modals/event";
import { EventService } from "../../services/event.service";
import { Storage } from "@ionic/storage";
import { EventPage } from "../event/event";
import { User } from "../../shared/models/user";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    show: boolean = false;
    eventSource;
    viewTitle;
    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private eventService: EventService,
        private storage: Storage
    ) { }

    ionViewDidLoad() {
        this.init();
    }

    init() {
        this.storage.get('currentUser').then(user => {
            this.eventService.list().subscribe(events => {
                this.eventSource = events.filter(event => event.user.email === user.email || this._findUser(event.users, user.email));
                for (let f of this.eventSource) {
                    let dateStart = new Date(f.startTime);
                    let dateEnd = new Date(f.endTime);
                    f.startTime = new Date(Date.UTC(dateStart.getUTCFullYear(), dateStart.getUTCMonth(), dateStart.getUTCDate(), dateStart.getUTCHours() - 2, dateStart.getUTCMinutes()));
                    f.endTime = new Date(Date.UTC(dateEnd.getUTCFullYear(), dateEnd.getUTCMonth(), dateEnd.getUTCDate(), dateEnd.getUTCHours() - 2, dateEnd.getUTCMinutes()));
                }
                this.show = true;
            });
        });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        this.navCtrl.push(EventPage, { event: event });
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }

    onCurrentDateChanged(event: Date) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    createEvent() {
        this.show = false;
        let eventModal = this.modalCtrl.create(EventModal, { mode: 'add' });
        eventModal.onDidDismiss(data => {
            this.init();
        });
        eventModal.present();
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date:Date) => {
        let current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    _findUser(users: User[], email: string): boolean {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                return true;
            }
        }
        return false;
    }

}
