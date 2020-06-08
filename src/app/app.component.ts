import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import { AdminUsers } from "./models/admin.users";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false;
  email: string = '';
  isLogout = true

  constructor(private router: Router) {
  }

  checkLoggedInAccess() {
    this.email = localStorage.getItem('email');
    if (this.email == null) {
      this.email = '';
    }
    firebase.auth().onAuthStateChanged(userData => {
      if (userData) {
        this.isLoggedIn = true;
        localStorage.setItem('logged', 'true');
        if (this.email == '') {
          this.logUserOut(true)
        }
      } else {
        localStorage.setItem('logged', 'false');
        if (this.isLogout) {
          this.logUserOut(true)
        } else {
          this.logUserOut(true)
        }
      }
    });
  }

  checkblockeduser() {
    this.email = localStorage.getItem('email');
    if (this.email == null) {
      return
    }
    firebase.firestore().collection('db').doc('votecad').collection('users').doc(this.email).onSnapshot(user => {
      const m = <AdminUsers>user.data()
      if (m != null) {
        const blocked: boolean = m.blocked
        if (blocked) {
          this.logUserOut(true)
        }
      }
    })
  }

  logUserOut(clearAll: boolean) {
    if (clearAll) {
      this.isLoggedIn = false;
      firebase.auth().signOut();
      localStorage.clear();
      this.router.navigate(['/login'])
    }
  }

  ngOnInit(): void {
    firebase.initializeApp(environment.firebase);

    this.checkLoggedInAccess()
    this.checkblockeduser()
  }

}
