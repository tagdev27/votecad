import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BackEndUsersComponent } from 'src/app/settings/backend-users/backend-users.component';
import { RolesComponent } from 'src/app/settings/roles/roles.component';


import { AppOverlayModule } from '../../overlay/overlay.module';
import { ProgressSpinnerModule,ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';

// import { ToastrModule } from 'ngx-toastr';
import { ThemeModule } from '../../@theme/theme.module';
// import { NbEvaIconsModule } from "@nebular/eva-icons";
import { FilePickerModule } from  'ngx-awesome-uploader';
import { NbMenuModule, NbUserModule, NbCardModule, NbIconModule, NbInputModule, NbDialogModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { CategoryComponent } from 'src/app/settings/category/category.component';
import { SlidersComponent } from 'src/app/settings/sliders/sliders.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    Ng2SmartTableModule,
    ThemeModule.forRoot(),
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbDialogModule.forChild(),
    FilePickerModule,
    NbUserModule,
    AppOverlayModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    BackEndUsersComponent,
    RolesComponent,
    CategoryComponent,
    SlidersComponent,
  ],
  entryComponents: [ProgressSpinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AdminLayoutModule {}
