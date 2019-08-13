import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      //onAuthStateChanged() method connects to Firebase Authentication and listens to changes in the user state to respond to them
      //it adds an observer for auth state changes, meaning that whenever an authentication change happens, it will trigger the observer and the function inside it will run again
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          console.log('User is not logged in.');
          this.router.navigate(['/welcome']);
          resolve(false);
        }
      });
    });
  }
}
