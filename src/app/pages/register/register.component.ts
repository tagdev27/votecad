import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import swal from 'sweetalert2';
import { AdminUsers } from "../../models/admin.users";
import { AdminUsersService } from "../../services/admin-users.service";
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // private adminUser: AdminUsers;
  // private adminService = new AdminUsersService();

  login_pressed = false;

  config = new AppConfig()

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  register() {
    const email = (<HTMLInputElement>document.getElementById("mEmail")).value.toLowerCase();
    const password = (<HTMLInputElement>document.getElementById("mPassword")).value;
    const name = (<HTMLInputElement>document.getElementById("mName")).value
    const position = (<HTMLInputElement>document.getElementById("mPosition")).value;

    if (email == '' || password == '' || name == '' || position == '') {
      this.config.displayMessage("All fields must be filled.", false)
      return
    }

    this.login_pressed = true;
    const key = firebase.database().ref().push().key

    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      const new_user: AdminUsers = {
        id: key,
        email: email,
        name: name,
        position: position,
        image: 'assets/img/default-avatar.png',
        role: 'Agents',
        access_levels: '',
        blocked: false,
        approved: false,
        user_type: 'agent',
        user_role_type: 'owner',
        created_by: this.randomInt(1, 9999999999),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }

      firebase.firestore().collection('db').doc('votecad').collection('users').doc(email).set(new_user).then(d => {
        firebase.auth().signOut()
        this.login_pressed = false;
        this.config.displayMessage('Registration successful. An email will be sent to you upon approval.', true)
        // location.href = '/register'
        document.getElementById("mEmail").innerText = ''
        document.getElementById("mPassword").innerText = ''
        document.getElementById("mName").innerText = ''
        document.getElementById("mPosition").innerText = ''
      })
    })
      .catch(err => {
        this.login_pressed = false;
        this.config.displayMessage(`${err}`, false)
      })
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
