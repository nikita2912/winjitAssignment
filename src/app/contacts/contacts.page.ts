import { Component, OnInit } from '@angular/core';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})

export class ContactsPage implements OnInit {
  contactList: any;

  constructor(private contacts: Contacts, private platform: Platform, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.groupContacts();
  }

  //To fetched all contacts
  groupContacts() {

    let options = {
      filter: '',
      multiple: true,
      hasPhoneNumber: true
    };
    this.loadingCtrl.create({
      spinner: "crescent",
      duration: 2000
    }).then((res) => {
      res.present();

      this.contacts.find(['*'], options).then((contacts: Contact[]) => {
        this.contactList = contacts;
      });
    });
  }
}
