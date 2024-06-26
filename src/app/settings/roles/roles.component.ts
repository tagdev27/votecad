import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/database'
import swal from 'sweetalert2';
import { LocalDataSource } from 'ng2-smart-table';
import { RoleUsers } from 'src/app/models/role.users';
import { AdminUsers } from 'src/app/models/admin.users';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { AppConfig } from 'src/app/services/global.service';
import { OverlayService } from 'src/app/overlay/overlay.module';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.module';
import { NbDialogService } from '@nebular/theme';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-settings-roles',
    styleUrls: ['./roles.component.scss'],
    templateUrl: './roles.component.html',
})

export class RolesComponent {

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
            access_levels: {
                title: 'Access Levels',
                type: 'string',
            }
        },
    };
    source: LocalDataSource = new LocalDataSource();
    data = []
    roles: RoleUsers[] = []
    users: AdminUsers[] = []
    services = new AdminUsersService()
    config = new AppConfig()
    button_pressed = false

    isAddRole = true
    currentRole: any = {}
    accountRole: string = ''
    currentUserEmail = ''
    currentLevel: string[] = [];
    levels = []

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    closeResult = ''

    @ViewChild('role', { static: false }) private roleContainer: ElementRef;//TemplateRef<any>;

    constructor(private modalService: NgbModal, private dialogService: NbDialogService, private previewProgressSpinner: OverlayService) {
    }

    getRoles() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('db').doc('votecad').collection('roles').where('user_type', '==', 'admin').onSnapshot(query => {
                this.data = []
                this.roles = []
                var index = 1
                query.forEach(data => {
                    const role = <RoleUsers>data.data()
                    this.data.push({ 'id': index, 'name': role.name, 'userID': role.id, 'access_levels': role.access_levels })
                    this.roles.push(role)
                    index = index + 1
                })
                this.source.load(this.data)
            });
            return
        }
        firebase.firestore().collection('db').doc('votecad').collection('roles').where('created_by', '==', this.main_user_id).onSnapshot(query => {
            this.data = []
            this.roles = []
            var index = 1
            query.forEach(data => {
                const role = <RoleUsers>data.data()
                this.data.push({ 'id': index, 'name': role.name, 'userID': role.id, 'access_levels': role.access_levels })
                this.roles.push(role)
                index = index + 1
            })
            this.source.load(this.data)
        });
    }

    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getRoles()
            this.setLevels()
        })
    }

    setLevels() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            this.levels = [
                { value: 'Shows/Events', viewValue: 'Shows/Events' },
                { value: 'Contestants', viewValue: 'Contestants' },
                { value: 'Merchants', viewValue: 'Merchants' },
                { value: 'Users', viewValue: 'Users' },
                { value: 'Transactions', viewValue: 'Transactions' },
                { value: 'Settings', viewValue: 'Settings' },
                { value: 'Logs', viewValue: 'Logs' },
                { value: 'Category', viewValue: 'Category' },
                { value: 'Slider Settings', viewValue: 'Slider Settings' },
                { value: 'Roles', viewValue: 'Roles' },
                { value: 'Backend-Users', viewValue: 'Backend-Users' }
            ];
            return
        }
        if (this.main_user_type == 'agent' && this.main_user_role_type == 'owner') {
            this.levels = [
                { value: 'Shows/Events', viewValue: 'Shows/Events' },
                { value: 'Contestants', viewValue: 'Contestants' },
            ];
            return
        }
    }

    editRole(role: any) {
        if (role.data.name == 'VoteCad-Administrator-Owner') {
            this.config.displayMessage("This role can't be edited", false);
            return
        }
        this.isAddRole = false
        this.currentRole = role.data
        this.currentLevel = role.data.access_levels.split(",")
        this.open(this.roleContainer, '', '')
    }

    deleteRole(role: any) {
        if (role.data.name == 'VoteCad-Administrator-Owner') {
            this.config.displayMessage("This role can't be deleted", false);
            return
        }
        const id = role.data.userID
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this role?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('votecad').collection('roles').doc(id).delete().then(del => {
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

    addRole() {
        this.isAddRole = true
        this.currentRole = {}
        this.currentLevel = []
        this.open(this.roleContainer, '', '')
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    roleButtonAction() {
        const role_name = (<HTMLInputElement>document.getElementById("role_name")).value;
        if (role_name == '') {
            this.config.displayMessage("Please enter the name of this role", false)
            return
        }
        if (this.currentLevel.length == 0) {
            this.config.displayMessage("Please select one or two access levels for this role", false)
            return
        }
        if (this.isAddRole) {
            // this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
            this.button_pressed = true
            const key = firebase.database().ref().push().key
            const rolePush: RoleUsers = {
                name: role_name,
                id: key,
                access_levels: this.currentLevel.join(','),
                created_by: this.main_user_id,
                user_type: this.main_user_type,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
            firebase.firestore().collection('db').doc('votecad').collection('roles').doc(key).set(rolePush).then(d => {
                this.button_pressed = false
                this.isAddRole = true
                this.currentLevel = []
                this.config.displayMessage("Successfully created", true);
                this.modalService.dismissAll()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            // this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
            this.button_pressed = true
            const key = this.currentRole.userID
            const rolePush = {
                'name': role_name,
                'access_levels': this.currentLevel.join(',')
            }
            firebase.firestore().collection('db').doc('votecad').collection('roles').doc(key).update(rolePush).then(d => {
                this.button_pressed = false
                this.isAddRole = true
                this.currentLevel = []
                this.config.displayMessage("Successfully updated", true);
                this.modalService.dismissAll()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        }
    }

    open(content, type, modalDimension) {
        if (modalDimension === 'sm' && type === 'modal_mini') {
            this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
                this.closeResult = 'Closed with: $result';
            }, (reason) => {
                this.closeResult = 'Dismissed $this.getDismissReason(reason)';
            });
        } else if (modalDimension === '' && type === 'Notification') {
            this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
                this.closeResult = 'Closed with: $result';
            }, (reason) => {
                this.closeResult = 'Dismissed $this.getDismissReason(reason)';
            });
        } else {
            this.modalService.open(content, { centered: true }).result.then((result) => {
                this.closeResult = 'Closed with: $result';
            }, (reason) => {
                this.closeResult = 'Dismissed $this.getDismissReason(reason)';
            });
        }
    }

    // open(dialog: TemplateRef<any>) {
    //     this.dialogService.open(dialog);
    // }
}