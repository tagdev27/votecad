import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/database'
import { OverlayService } from '../../overlay/overlay.module';
import { AdminUsersService } from 'src/app/services/admin-users.service';
import { AppConfig } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-settings',
    styleUrls: ['./settings.component.scss'],
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

    services = new AdminUsersService()
    config = new AppConfig()
    closeResult = ''

    isAdd = false

    display_users = true

    button_pressed = false

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    model_voting_credit_per_vote = 0
    model_voting_credit_naira = 0


    constructor(private previewProgressSpinner: OverlayService, private http: HttpClient) {
    }

    getSettings() {
        firebase.firestore().collection('db').doc('votecad').collection('settings').doc('general').get().then(query => {
            const s = query.data()
            this.model_voting_credit_per_vote = s['model_voting_credit_per_vote']
            this.model_voting_credit_naira = s['model_voting_credit_naira']
        })
    }

    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getSettings()
        })
    }

    // cancelAddUser() {
    //     this.display_users = true
    //     this.model_voting_credit_per_vote = ''
    //     this.model_image = ''
    //     this.model_url = ''
    //     this.isAdd = true
    //     this.button_pressed = false
    // }

    registerUser() {
        if (this.model_voting_credit_per_vote == 0 || this.model_voting_credit_naira == 0) {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }
        this.button_pressed = true
        const key = firebase.database().ref().push().key
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')

        firebase.firestore().collection('db').doc('votecad').collection('settings').doc('general').update({
            'model_voting_credit_per_vote': this.model_voting_credit_per_vote,
            'model_voting_credit_naira': this.model_voting_credit_naira
        }).then(d => {
            this.config.logActivity(`${current_name}|${current_email} updated general settings`)
            this.button_pressed = false
            this.config.displayMessage(`Settings updated successfully.`, true);
            // this.cancelAddUser()
        }).catch(err => {
            this.button_pressed = false
            this.config.displayMessage(`${err}`, false);
        })
    }

    // editUser(user: any) {
    //     this.selectedCatID = `${user.data.userID}`
    //     this.display_users = false
    //     this.isAdd = false
    //     this.model_name = user.data.name
    //     this.model_image = user.data.img
    //     this.model_url = user.data.urlText
    // }
}