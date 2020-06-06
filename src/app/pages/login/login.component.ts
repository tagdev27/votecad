import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import swal from 'sweetalert2';
import { AdminUsers } from "../../models/admin.users";
import { AdminUsersService } from "../../services/admin-users.service";
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private adminUser: AdminUsers;
  private adminService = new AdminUsersService();

  login_pressed = false;
  forgot_pressed = false;

  config = new AppConfig()

  constructor(private router: Router) {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  login() {
    const checkBox = false//(<HTMLInputElement>document.getElementById("customCheckLogin")).checked
    const email = (<HTMLInputElement>document.getElementById("mEmail")).value.toLowerCase();
    const password = (<HTMLInputElement>document.getElementById("mPassword")).value;

    if (email == '' || password == '') {
      this.displayMessage("All fields must be filled.", false)
      return
    }

    this.login_pressed = true;

    if (checkBox) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        //console.log(user)
        this.adminService.getUserData(email).then(ud => {
          //console.log(ud)
          if (ud == null) {
            firebase.auth().signOut()
            this.displayMessage('User does not exist.', false)
            return
          }
          if (ud.blocked) {
            firebase.auth().signOut()
            this.displayMessage('Your account has been blocked. Please contact your Admin.', false)
            return
          }
          if (ud.user_type == 'agent') {
            if (!ud.approved) {
              firebase.auth().signOut()
              this.displayMessage('Your account has not yet been approved.', false)
              return
            }
          }
          this.config.logActivity(`${ud.name} logged in to dashboard`)
          localStorage.setItem('logged', 'true');
          localStorage.setItem('email', email);
          localStorage.setItem('name', ud.name);
          localStorage.setItem('dp', ud.image);
          this.login_pressed = false;
          this.router.navigate(['/dashboard'])
          //location.reload(true)
        }).catch(err => {
          firebase.auth().signOut()
          this.displayMessage(`${err}`, false)
        })
      }).catch(err => {
        this.displayMessage(`${err}`, false)
      })
      return
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      this.adminService.getUserData(email).then(ud => {
        if (ud == null) {
          firebase.auth().signOut()
          this.displayMessage('User does not exist.', false)
          return
        }
        if (ud.blocked) {
          firebase.auth().signOut()
          this.displayMessage('Your account has been blocked. Please contact your Admin.', false)
          return
        }
        if (ud.user_type == 'agent') {
          if (!ud.approved) {
            firebase.auth().signOut()
            this.displayMessage('Your account has not yet been approved.', false)
            return
          }
        }
        this.config.logActivity(`${ud.name} logged in to dashboard`)
        localStorage.setItem('email', email);
        localStorage.setItem('name', ud.name);
        localStorage.setItem('dp', ud.image);
        this.login_pressed = false;

        this.router.navigate(['/dashboard'])
      }).catch(err => {
        firebase.auth().signOut()
        this.displayMessage(`${err}`, false)
      })

    }).catch(err => {
      this.displayMessage(`${err}`, false)
    })
  }

  forgotpassword() {
    const email = (<HTMLInputElement>document.getElementById("mEmail")).value.toLowerCase();
    if (email == '') {
      this.displayMessage("Please enter your email address.", false)
      return
    }
    this.forgot_pressed = true;
    firebase.auth().sendPasswordResetEmail(email).then(user => {
      this.displayMessage("Password reset instructions sent successfully.", true)
    }).catch(err => {
      this.displayMessage(`${err}`, false)
    })
  }

  displayMessage(msg: string, success: boolean) {
    this.login_pressed = false;
    this.forgot_pressed = false;
    swal({
      title: msg,
      buttonsStyling: false,
      confirmButtonClass: (!success) ? "btn btn-danger" : "btn btn-success"
    }).catch(swal.noop)
  }

}
