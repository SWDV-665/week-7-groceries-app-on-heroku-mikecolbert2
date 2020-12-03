import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery List"

  items = [];
  errorMessage: string;

  constructor(
    public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dataService: GroceriesServiceProvider,
    public inputDialogService: InputDialogServiceProvider,
    public socialSharing: SocialSharing,
    ) {
      dataService.dataChanged$.subscribe((dataChanged: boolean) => {
        this.loadItems();
      });
    }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems(){
    this.dataService.getItems().subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
  }

  removeItem(item, id) {
    console.log("removing item - ", id); 

    this.dataService.removeItem(id);
       
  }

  shareItem(item, index) {
    console.log("sharing item - ", item, index); 

    const toast = this.toastCtrl.create({
      message: "Sharing item - " + index + " ...",
      duration: 3000
    });   
    toast.present();
   
    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });  
       
  }

  editItem(item, id) {
    console.log("editing item - ", item, id); 

    const toast = this.toastCtrl.create({
      message: "Editing item - " + id + " ...",
      duration: 3000
    });   
    toast.present();
    
    // pass the item and index to our edit prompt
    this.inputDialogService.showPrompt(item, item._id)
  }


  addItem(){
    console.log("adding item");
    this.inputDialogService.showPrompt();
  }

  
}
