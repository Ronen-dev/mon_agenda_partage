import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventService } from "../../services/event.service";
import { Storage } from "@ionic/storage";
import { User } from "../../shared/models/user";

@Component({
    selector: 'page-calendar',
    templateUrl: 'calendar.html'
})
export class CalendarPage {

    currentUser: User;
    user: User;
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
        private eventService: EventService,
        public navParams: NavParams,
        private storage: Storage
    ) { }

    ionViewDidLoad() {
        this.init();
    }

    init() {
        this.user = this.navParams.get('user');
        this.storage.get('currentUser').then(user => {
            this.currentUser = user;
            this.eventService.list().subscribe(events => {
                this.eventSource = events.filter(event =>
                    ((event.user.email === this.user.email || this._findUser(event.users, this.user.email)) && event.visible)
                    || (event.user.email === this.currentUser.email && this.user.email === this.currentUser.email)
                );
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
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
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
