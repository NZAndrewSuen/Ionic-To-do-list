import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  //login normally
  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  //login facebook
  async loginUserViaFacebook(): Promise<firebase.auth.UserCredential> {
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    if (result.accessToken) {
      // Login successful
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(result.accessToken.token);

      return firebase.auth().signInWithCredential(facebookCredential);
    } else {
      // Cancelled by user.
    }
  }

  //register new user
  async signupUser(email: string, password: string, uid: string, firstName: string = ""): Promise<any> {
    // sign up normally
    if (uid == null) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((newUserCredential: firebase.auth.UserCredential) => {
          //also create new record in doc userProfile
          firebase
            .firestore()
            .doc(`/userProfile/${newUserCredential.user.uid}`) //template strings
            .set({ email });
        })
        .catch(error => {
          console.error(error);
          throw new Error(error);
        });
    }
    // login facebook
    else {
      //also create new record in doc userProfile
      firebase
        .firestore()
        .doc(`/userProfile/${uid}`)
        .set({ email, firstName });
    }
  }

  //reset password
  //a void Promise, meaning that even return a Promise, the promise is empty
  //so you mainly use it to perform other actions once it sends the password reset link
  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  //signout user
  async logoutUser(): Promise<void> {
    var providerId = firebase.auth().currentUser.providerId;

    //in case login facebook, we also need to call facebook logout function
    if (providerId == "facebook.com") {
      await Plugins.FacebookLogin.logout();
    }

    return firebase.auth().signOut();
  }
}