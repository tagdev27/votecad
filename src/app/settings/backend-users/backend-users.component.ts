import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/database'
import swal from 'sweetalert2';
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { RoleUsers } from 'src/app/models/role.users';
import { AdminUsers } from 'src/app/models/admin.users';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { AppConfig } from 'src/app/services/global.service';
import { NbDialogService } from '@nebular/theme';

@Component({
    selector: 'app-settings-backend-users',
    styleUrls: ['./backend-users.component.scss'],
    templateUrl: './backend-users.component.html',
})
export class BackEndUsersComponent implements OnInit {

    settings = {
        add: {
            addButtonContent: 'ADD',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
            editButtonContent: 'EDIT',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
            deleteButtonContent: 'DELETE',
            confirmDelete: true,
        },
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                type: 'number',
            },
            name: {
                title: 'Name',
                type: 'string',
            },
            email: {
                title: 'Email Address',
                type: 'string',
            },
            position: {
                title: 'Position',
                type: 'string',
            },
            role: {
                title: 'Role',
                type: 'string',
            },
            blocked: {
                title: 'Blocked',
                type: 'string',
            },
            approved: {
                title: 'Approved',
                type: 'string',
            },
        },
    };

    source: LocalDataSource = new LocalDataSource();
    data = []
    roles: RoleUsers[] = []
    users: AdminUsers[] = []
    services = new AdminUsersService()
    config = new AppConfig()
    closeResult = ''

    isAddRole = true
    currentRole: any = []
    accountRole: string = ''
    currentUserEmail = ''

    display_users = true

    button_pressed = false

    blocked_status: string = '';
    blocks_data = [
        { value: 'false', viewValue: 'False' },
        { value: 'true', viewValue: 'True' },
    ]

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    @ViewChild('user', { static: false }) private userContainer: TemplateRef<any>;

    constructor(private dialogService: NbDialogService, private previewProgressSpinner: OverlayService) {
    }

    getUsers() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('db').doc('votecad').collection('users').where('user_type', '==', 'admin').onSnapshot(query => {
                this.data = []
                this.users = []
                var index = 0
                query.forEach(data => {
                    const user = <AdminUsers>data.data()
                    this.users.push(user)
                    this.data.push({ 'id': `${index + 1}`, 'userID': user.id, 'name': user.name, 'email': user.email, 'position': user.position, 'role': user.role, 'access_levels': user.access_levels, 'blocked': `${user.blocked}`, 'approved': `${user.approved}` })
                    index = index + 1
                })
                this.source.load(this.data)
            })
            return
        }
        firebase.firestore().collection('db').doc('votecad').collection('users').where('created_by', '==', this.main_user_id).onSnapshot(query => {
            this.data = []
            this.users = []
            var index = 0
            query.forEach(data => {
                const user = <AdminUsers>data.data()
                this.users.push(user)
                this.data.push({ 'id': `${index + 1}`, 'userID': user.id, 'name': user.name, 'email': user.email, 'position': user.position, 'role': user.role, 'access_levels': user.access_levels, 'blocked': `${user.blocked}`, 'approved': `${user.approved}` })
                index = index + 1
            })
            this.source.load(this.data)
        })
    }

    getRoles() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('db').doc('votecad').collection('roles').where('user_type', '==', 'admin').get().then(query => {
                this.roles = []
                query.forEach(data => {
                    const role = <RoleUsers>data.data()
                    this.roles.push(role)
                })
            });
            return
        }
        firebase.firestore().collection('db').doc('votecad').collection('roles').where('created_by', '==', this.main_user_id).get().then(query => {
            this.roles = []
            query.forEach(data => {
                const role = <RoleUsers>data.data()
                this.roles.push(role)
            })
        });
    }


    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getUsers()
            this.getRoles()
        })
    }

    addUser() {
        this.display_users = false
    }

    cancelAddUser() {
        this.display_users = true
    }

    registerUser() {
        const name = (<HTMLInputElement>document.getElementById("account_name")).value;
        const email = (<HTMLInputElement>document.getElementById("email")).value;
        const position = (<HTMLInputElement>document.getElementById("position")).value;
        const ar = this.accountRole
        if (name == '' || email == '' || position == '' || this.accountRole == '') {
            this.config.displayMessage("Please enter all fields", false)
            return
        }
        // if (email.search('@targlobalplacement.com') < 0) {
        //     this.config.displayMessage("Invalid email address", false)
        //     return
        // }
        const searchedUsers = this.users.filter(function (item, index, array) {
            return item.email == email;
        })
        if (searchedUsers.length > 0) {
            this.config.displayMessage("Email address already exist", false)
            return
        }
        const searchedRole = this.roles.filter(function (item, index, array) {
            return item.name == ar;
        })
        this.button_pressed = true
        const key = firebase.database().ref().push().key
        const reg_user: AdminUsers = {
            id: key,
            access_levels: searchedRole[0].access_levels,
            blocked: false,
            approved: false,
            email: email.toLowerCase(),
            image: 'assets/img/default-avatar.png',
            name: name,
            user_type: this.main_user_type,
            user_role_type: 'staff',
            position: position,
            role: this.accountRole,
            created_by: this.main_user_id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        firebase.firestore().collection('db').doc('votecad').collection('users').doc(key).set(reg_user).then(d => {
            this.button_pressed = false
            this.config.displayMessage("User successfully created.", true);
            this.display_users = true
            this.accountRole = ''
        }).catch(err => {
            this.button_pressed = false
            this.config.displayMessage(`${err}`, false);
        })
    }

    editUser(user: any) {
        if (user.data.role == 'VoteCad-Administrator-Owner') {
            this.config.displayMessage("This user can't be edited", false);
            return
        }
        this.currentUserEmail = user.data.userID
        this.blocked_status = user.data.blocked
        this.accountRole = user.data.role
        this.open(this.userContainer)
    }

    deleteUser(user: any) {
        console.log(user.data.role)
        if (user.data.role == 'VoteCad-Administrator-Owner') {
            this.config.displayMessage("This user can't be deleted", false);
            return
        }
        const id = `${user.data.userID}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this user?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('votecad').collection('users').doc(id).delete().then(del => {
                    this.config.displayMessage("Successfully deleted", true);
                }).catch(err => {
                    this.config.displayMessage(`${err}`, false);
                })
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Deletion not successful',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }
        })
    }

    userButtonAction() {
        if (this.accountRole == '' || this.blocked_status == '') {
            this.config.displayMessage("All fields must be filled", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        const ar = this.accountRole
        const searchedRole = this.roles.filter(function (item, index, array) {
            return item.name == ar;
        })
        firebase.firestore().collection('db').doc('votecad').collection('users').doc(this.currentUserEmail).update({
            'blocked': (this.blocked_status == 'true') ? true : false,
            'role': ar,
            'access_levels': searchedRole[0].access_levels
        }).then(d => {
            this.previewProgressSpinner.close()
            this.config.displayMessage("User successfully updated.", true);
            this.accountRole = ''
            this.blocked_status = ''
            this.currentUserEmail = ''
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false);
        })
    }

    open(dialog: TemplateRef<any>) {
        this.dialogService.open(dialog);
    }
}