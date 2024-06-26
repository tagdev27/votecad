import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { BackEndUsersComponent } from 'src/app/settings/backend-users/backend-users.component';
import { RolesComponent } from 'src/app/settings/roles/roles.component';
import { RouteGuard } from 'src/app/route.guard';
import { CategoryComponent } from 'src/app/settings/category/category.component';
import { SlidersComponent } from 'src/app/settings/sliders/sliders.component';
import { ShowsComponent } from 'src/app/pages/shows/shows.component';
import { PeopleComponent } from 'src/app/pages/people/people.component';
import { MerchantsComponent } from 'src/app/pages/merchants/merchants.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { SettingsComponent } from 'src/app/settings/settings/settings.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { 
        path: 'backend-users', 
        component: BackEndUsersComponent,
        canActivate: [RouteGuard]
    },
    { 
        path: 'roles', 
        component: RolesComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'sliders',
        component: SlidersComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'shows',
        component: ShowsComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'contestants',
        component: PeopleComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'organizers',
        component: MerchantsComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [RouteGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [RouteGuard]
    },
    { 
        path: 'user-profile', 
        component: UserProfileComponent,
        canActivate: [RouteGuard]
    },
    { 
        path: 'tables', 
        component: TablesComponent,
        canActivate: [RouteGuard]
    },
    { 
        path: 'icons', 
        component: IconsComponent,
        canActivate: [RouteGuard]
    },
    { 
        path: 'maps', 
        component: MapsComponent,
        canActivate: [RouteGuard]
    }
];
