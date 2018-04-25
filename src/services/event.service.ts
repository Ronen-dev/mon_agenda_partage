import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { Event } from "../shared/models/event";

@Injectable()
export class EventService {

    constructor(
        private db: AngularFireDatabase
    ) { }

    fireList(): AngularFireList<{}> {
        return this.db.list('event');
    }

    list(): Observable<Event[]> {
        return this.fireList().snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
    }
}
