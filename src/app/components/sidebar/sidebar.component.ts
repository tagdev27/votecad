import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUsers } from 'src/app/models/admin.users';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import swal from 'sweetalert2';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  access: boolean;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', access: true },
  { path: '/backend-users', title: 'Backend-Users', icon: 'ni-app text-blue', class: '', access: false },
  { path: '/roles', title: 'Roles', icon: 'ni-lock-circle-open text-blue', class: '', access: false },
  { path: '/category', title: 'Category', icon: 'ni-bullet-list-67 text-blue', class: '', access: false },
  { path: '/sliders', title: 'Slider Settings', icon: 'ni-album-2 text-blue', class: '', access: false },
  { path: '/shows', title: 'Shows/Events', icon: 'ni-calendar-grid-58 text-blue', class: '', access: false },
  { path: '/contestants', title: 'Contestants', icon: 'ni-user-run text-blue', class: '', access: false },
  { path: '/merchants', title: 'Merchants', icon: 'ni-circle-08 text-blue', class: '', access: false },
  { path: '/users', title: 'Users', icon: 'ni-single-02 text-blue', class: '', access: false },
  { path: '/transactions', title: 'Transactions', icon: 'ni-credit-card text-blue', class: '', access: false },
  { path: '/settings', title: 'Settings', icon: 'ni-settings text-blue', class: '', access: false },
  // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '', access: false },
  // { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '', access: false },
  // { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '', access: false },
  // { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '', access: false },
  // { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '', access: false },
  // { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '', access: false }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[] = [];
  public isCollapsed = true;

  user: AdminUsers
  name: string = 'Username';
  image: string = './assets/img/default-avatar.png';
  role: string = 'user';
  access_level = '';
  service = new AdminUsersService();

  constructor(private router: Router) {
    this.getProfile();
  }

  getProfile() {
    const email = localStorage.getItem('email');
    this.service.getUserData(email).then(async p => {
      if (p == null) {
        this.service.getUserData(email).then(async q => {
          if(q==null){
            return
          }
          this.name = q.name;
          this.image = q.image;
          this.role = q.role;
          if (q.role == 'Administrator') {
            this.access_level = q.access_levels;
          } else {
            const getRole = await this.getAccessLevelsUsingRoles(q.role)
            const vars = getRole.docs[0].data()
            this.access_level = vars['access_levels']
          }
          this.displayNav();
        })
      } else {
        this.name = p.name;
        this.image = p.image;
        this.role = p.role;
        if (p.role == 'Administrator') {
          this.access_level = p.access_levels;
        } else {
          const getRole = await this.getAccessLevelsUsingRoles(p.role)
          const vars = getRole.docs[0].data()
          this.access_level = vars['access_levels']
        }
        this.displayNav();
      }
    })
  }

  async getAccessLevelsUsingRoles(role: string) {
    return await firebase.firestore().collection('db').doc('votecad').collection('roles').where('name', '==', role).get()
  }

  displayNav() {
    ROUTES.forEach(menuItem => {
        if (menuItem.title == 'Dashboard') {
            this.menuItems.push(menuItem);
        } else {
            if (this.role == 'VoteCad-Administrator-Owner') {
                menuItem.access = true;
                this.menuItems.push(menuItem);
            } else {
                //console.log(`Access to ${menuItem.title} is ${this.service.isAllowedAccess(this.access_level, menuItem.title)}`)
                menuItem.access = this.service.isAllowedAccess(this.access_level, menuItem.title);
                this.menuItems.push(menuItem);
            }
        }
    })
}

gotoLink(menu_path:any) {
  if (this.role == 'VoteCad-Administrator-Owner') {
      this.router.navigate([`${menu_path}`])
  } else {
      location.href = `${menu_path}`
  }
}

  ngOnInit() {
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
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
