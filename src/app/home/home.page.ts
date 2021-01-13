import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encryptedText: any;
  encryptPass: any;
  testName: any
  secureKey = '12345678910123456789012345678901'; // Any string, the length should be 32
  secureIV = '1234567891123456'; // Any string, the length should be 16

  constructor(private route: ActivatedRoute, private platform: Platform, private aes256: AES256,) {
    this.route.queryParams.subscribe(params => {
      this.encryptPass = params.encryptPass;
    });
    this.encryptedText = "";
    this.generateSecureKeyAndIV();
  }

  async generateSecureKeyAndIV() {
    this.secureKey = await this.aes256.generateSecureKey('random password 12345'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('random password 12345'); // Returns a 16 bytes string
  }

  //For text encryption
  encryptText(encryptKey) {
    this.platform.ready().then(() => {
      this.aes256.encrypt(this.secureKey, this.secureIV, encryptKey)
        .then((res) => {
          this.encryptedText = res;
        })
        .catch((error: any) => console.error(error));
    });
  }
}
