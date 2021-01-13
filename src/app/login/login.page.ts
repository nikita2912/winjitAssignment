import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  userName: any;
  loginPassword: any;
  isSubmitted = false;
  encryptPassword: any;
  errorMsg: any;
  secureKey = '12345678910123456789012345678901'; // Any string, the length should be 32
  secureIV = '1234567891123456'; // Any string, the length should be 16
  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private platform: Platform,
    private aes256: AES256,
    private toastCtrl: ToastController) {
    this.generateSecureKeyAndIV();
  }

  async generateSecureKeyAndIV() {
    this.secureKey = await this.aes256.generateSecureKey('random password 12345'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('random password 12345'); // Returns a 16 bytes string
  }
  ngOnInit() {
    this.userName = "";
    this.loginPassword = "";
    this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', Validators.required]
    })
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  loginSubmit() {

    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
      return false;

    } else {

      this.userName = this.loginForm.controls.name.value;
      this.loginPassword = this.loginForm.controls.password.value;


      if (this.userName == 'admin' && this.loginPassword == '123456') {
        this.encrypt(this.secureKey, this.secureIV, this.loginPassword);

      }
      else {
        this.errorMsg = "Please Enter valid Credentials..!"
        this.showMassage(this.errorMsg);
      }
    }

  }

  showMassage(errmsg) {
    this.toastCtrl.create({
      message: errmsg,
      position: 'middle',
      duration: 1000,
      cssClass: 'my-custom-class',
    }).then((toast) => {
      toast.present();

      toast.onDidDismiss().then((toast) => {
        this.userName = "";
        this.loginPassword = "";
      });
    });
  }

  //For password encryption
  encrypt(secureKey, secureIV, encryptKey) {

    this.platform.ready().then(() => {
      this.aes256.encrypt(secureKey, secureIV, encryptKey)
        .then((res) => {
          this.encryptPassword = res;
          let navigationExtras: NavigationExtras = {
            queryParams: {
              encryptPass: this.encryptPassword
            }
          };
          this.router.navigate(['/home'], navigationExtras);
        })
        .catch((error: any) => console.error(error));
    });
  }
}
