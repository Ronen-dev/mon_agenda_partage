import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'page-foyer',
	templateUrl: 'foyer.html'
})
export class FoyerPage {

	foyers: Observable<any[]> = null;

	constructor(
		private afAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController) {
	}

	// ionViewDidLoad() {
	// 	console.log('ionViewDidLoad FoyerPage');
	// }
    //
	// createNewFoyer() {
	// 	let newFoyer = this.alertCtrl.create({
	// 		title : "Nouveau Foyer",
	// 		message : "Entrez le nom de votre nouveau foyer",
	// 		inputs : [
	// 			{
	// 				name : "Foyer",
	// 				placeholder : "Foyer"
	// 			}
	// 		],
	// 		buttons : [
	// 			{
	// 				text : "Annuler",
	// 				handler : data => {
	// 					console.log("Annuler");
	// 				}
	// 			},
	// 			{
	// 				text : "Sauvegarder",
	// 				handler : data => {
	// 					console.log("Sauvegarder");
	// 					console.log(data)
	// 					this.addFoyer(data.Foyer);
	// 				}
	// 			}
	// 		]
	// 	});
	// 	newFoyer.present();
	// }
    //
	// ngOnInit() {
	// 	console.log(this.afAuth.authState);
	// 	this.foyers = this.db.list('foyers').valueChanges();
	// }
    //
	// addFoyer(value: string): void {
	// 	const foyerRef = this.db.list('foyers');
	// 	foyerRef.push({name : value});
	// }
}
