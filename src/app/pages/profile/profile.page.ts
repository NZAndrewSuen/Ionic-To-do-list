import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userProfile: any;
  public birthDate: Date;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  //this is part of Angular’s lifecycle events, it is called after the view rendered
  ngOnInit() {
    //get user profile then bind it into model
    this.profileService
      .getUserProfile()
      .get()
      .then(userProfileSnapshot => {
        this.userProfile = userProfileSnapshot.data();
        this.birthDate = userProfileSnapshot.data().birthDate;
      });
  }

  //update name
  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Please input your name',
      inputs: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'First name',
          value: this.userProfile.firstName,
        },
        {
          type: 'text',
          name: 'lastName',
          placeholder: 'Last name',
          value: this.userProfile.lastName,
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'OK',
          handler: data => {
            this.profileService
              .updateName(data.firstName, data.lastName)
              //after updated, we also need to update the model
              .then(
                () => {
                  this.userProfile.firstName = data.firstName;
                  this.userProfile.lastName = data.lastName;
                }
              );
          },
        },
      ],
    });
    await alert.present();
  }

  //update date of birth
  updateDOB(birthDate: string): void {
    //the (ionChange) can trigger on page load
    //so we want to make sure it’s not undefined
    if (birthDate === undefined) {
      return;
    }
    this.profileService.updateDOB(birthDate);
  }

  //update email
  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'New email' },
        { name: 'password', placeholder: 'Current password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'OK',
          handler: data => {
            this.profileService
              .updateEmail(data.newEmail, data.password)
              //after updated, we also need to update the model
              .then(() => {
                this.userProfile.email = data.newEmail;
              })
              .catch(async error => {
                const alertError = await this.alertCtrl.create({
                  header: 'Message',
                  message: `Error: ${error.message}`,
                  buttons: ['OK']
                });

                await alertError.present();
              });
          },
        },
      ],
    });
    await alert.present();
  }

  //update password
  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Current password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'OK',
          handler: data => {
            this.profileService.updatePassword(
              data.newPassword,
              data.oldPassword
            )
              //show success message 
              .then(async () => {
                const alertSuccess = await this.alertCtrl.create({
                  header: 'Message',
                  message: 'Your password has been changed successfully!',
                  buttons: ['OK']
                });

                await alertSuccess.present();
              })
              //show error
              .catch(async error => {
                const alertError = await this.alertCtrl.create({
                  header: 'Message',
                  message: `Error: ${error.message}`,
                  buttons: ['OK']
                });

                await alertError.present();
              });
          },
        },
      ],
    });
    await alert.present();
  }
}
