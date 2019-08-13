import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  public userProfile: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    //load user info (the letter avatar and their name)
    this.profileService
      .getUserProfile()
      .get()
      .then(userProfileSnapshot => {
        this.userProfile = userProfileSnapshot.data();
        //get first letter from firstName if we can
        //if we can't, then we have to get the first letter of email
        this.userProfile.firstLetter =
          (this.userProfile.firstName === undefined || this.userProfile.firstName.length == 0)
            ? this.userProfile.email.length > 0
              ? this.userProfile.email.charAt(0)
              : "A"
            : this.userProfile.firstName.charAt(0);
      });
  }

  //signout
  async logOut(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'Do you want to signout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK',
          handler: () => {
            //signout user, then redirect them to welcome page
            this.authService.logoutUser().then(() => {
              this.router.navigateByUrl('welcome');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  //some functions are still under development
  //and we can make user feel curious :D 
  async underDevelopment(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'This function will come in the next version.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
