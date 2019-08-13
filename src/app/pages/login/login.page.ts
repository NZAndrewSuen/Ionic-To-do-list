import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  isActiveToggleTextPassword: boolean = true; //use to show/hide password

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    //validation
    this.loginForm = this.formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  ngOnInit() {
  }

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      //the app needs to communicate with the server to log the user in
      //there might be a small delay in sending the user to the HomePage
      //so we are using a loading component to give a visual so the user can understand that it is loading
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      const email = loginForm.value.email;
      const password = loginForm.value.password;

      this.authService.loginUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('hpage');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
    }
  }

  //my favourite function: login facebook :D
  async loginFacebook(): Promise<void> {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();
    this.authService
      .loginUserViaFacebook()
      .then(
        async (userCredential) => {
          //if user is new user, we also need to register them to the system
          if (userCredential.additionalUserInfo.isNewUser) {
            await this.authService.signupUser(
              userCredential.user.email,
              null,
              userCredential.user.uid,
              userCredential.user.displayName
            )
          }

          //then navigate them to home page
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('hpage');
          });
        },
        error => {
          //show error if occurred
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
  }

  //two simple functions to support show/hide password
  toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }

  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }
}