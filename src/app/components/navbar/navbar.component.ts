import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import swal from 'sweetalert2';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location, private element: ElementRef, private router: Router) {
    this.location = location;
    this.getProfile()
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  name: string = 'Username';
  image: string = './assets/img/default-avatar.png';
  service = new AdminUsersService();

  getProfile() {
    const email = localStorage.getItem('email');
    this.service.getUserData(email).then(async p => {
      if (p == null) {
        this.service.getUserData(email).then(async q => {
          if (q == null) {
            return
          }
          this.name = q.name;
          this.image = q.image;
        })
      } else {
        this.name = p.name;
        this.image = p.image;
      }
    })
  }

  logout() {
    swal({
      title: 'Logout Alert',
      text: 'Are you sure about logging out?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, keep me',
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        firebase.auth().signOut();
        localStorage.clear();
        this.router.navigate(['/login'])
      } else {
        swal({
          title: 'Cancelled',
          text: 'Logout not successful',
          type: 'error',
          confirmButtonClass: "btn btn-info",
          buttonsStyling: false
        }).catch(swal.noop)
      }
    })
  }

}
