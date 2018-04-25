import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { Foyer } from "../shared/models/foyer";
import { User } from "../shared/models/user";

@Injectable()
export class FoyerService {

    constructor(
        private db: AngularFireDatabase
    ) { }

    fireList(): AngularFireList<{}> {
        return this.db.list('foyer');
    }

    list(): Observable<Foyer[]> {
        return this.fireList().snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
    }

    // listByUser(user: User): Observable<Foyer[]> {
    //     return this.db.list('foyer/createdBy',
    //         ref => ref.orderByChild('email').equalTo(user.email)
    //     ).valueChanges();
    // }
}
