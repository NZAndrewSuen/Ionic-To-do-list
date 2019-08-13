import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public userProfile: firebase.firestore.DocumentReference;
  public currentUser: firebase.User;

  constructor() {
    if (!this.currentUser) {
      this.currentUser = firebase.auth().currentUser;
      this.userProfile = firebase.firestore().doc(`/userProfile/${this.currentUser.uid}`)
    }

    //reload user info whenever authState changes
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.firestore().doc(`/userProfile/${user.uid}`);
      }
    });
  }

  //get user profile
  getUserProfile(): firebase.firestore.DocumentReference {
    return this.userProfile;
  }

  //update name
  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  //update date of birth
  updateDOB(birthDate: string): Promise<any> {
    return this.userProfile.update({ birthDate });
  }

  //update email
  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );

    return this.currentUser
      //some security-sensitive actions (deleting an account, setting a primary email address, and changing a password) require that the user has recently signed-in
      .reauthenticateWithCredential(credential)
      .then(() => {
        //we are not only going to alter the email from the database
        //we are going to change it from the authentication service too
        this.currentUser.updateEmail(newEmail).then(() => {
          this.userProfile.update({ email: newEmail });
        });
      });
  }

  //update password
  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );

    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => { this.currentUser.updatePassword(newPassword) });
  }
}