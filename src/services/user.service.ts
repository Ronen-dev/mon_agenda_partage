import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { User } from "../shared/models/user";

@Injectable()
export class UserService {

    constructor(
        private db: AngularFireDatabase
    ) { }

    fireList(): AngularFireList<{}> {
        return this.db.list('user');
    }

    list(): Observable<User[]> {
        return this.db.list('user').valueChanges();
    }

    // add(user: User, userFireList: AngularFireList<{}>): firebase.database.ThenableReference {
    //     return userFireList.push(user);
    // }
}
