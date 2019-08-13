import * as firebase from 'firebase/app';
import { firebaseConfig } from './credentials';

import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { SplashScreen, StatusBar } = Plugins;

import { registerWebPlugin } from '@capacitor/core';
//import { FacebookLogin } from '@rdlabo/capacitor-facebook-login';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    //registerWebPlugin(FacebookLogin);
    this.initializeApp();
  }

  initializeApp() {
    SplashScreen.hide().catch(error => {
      console.error(error);
    });

    StatusBar.hide().catch(error => {
      console.error(error);
    });
  }
}
