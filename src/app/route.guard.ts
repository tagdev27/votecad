import { CanActivate, ActivatedRoute } from "@angular/router";
import { AdminUsersService } from "./services/admin-users.service";

export class RouteGuard implements CanActivate {

    // /constructor(private router:ActivatedRoute){}

    service = new AdminUsersService();

    async canActivate() {
        const email = localStorage.getItem('email')
        if (email == null) {
            return false
        } else {
            const p = await this.service.getUserData(email)
            const levels = p.access_levels.toLowerCase()
            const current_menu = window.location.href.toLowerCase().split("/")[3]

            if(p.role == 'VoteCad-Administrator-Owner'){
                return true
            }else{
                return this.service.isAllowedAccess(levels, current_menu)
            }
        }
    }
}

export class LoginRouteGuard implements CanActivate {

    canActivate() {
        const email = localStorage.getItem('email')
        const logged = localStorage.getItem('logged')

        if (email == null && logged == null) {
            return true
        } else {
            return logged != 'false'
        }
    }
}