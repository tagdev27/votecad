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
import { Slider } from 'src/app/models/slider';
import { FilePickerAdapter, FilePreviewModel, ValidationError, FileValidationTypes } from 'ngx-awesome-uploader';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpEvent, HttpEventType, HttpClient } from '@angular/common/http';

var myFiles: FilePreviewModel[] = [];
var image_url = ''

@Component({
    selector: 'app-settings-sliders',
    styleUrls: ['./sliders.component.scss'],
    templateUrl: './sliders.component.html',
})
export class SlidersComponent implements OnInit {

    adapter = new DemoFilePickerAdapter(this.http);

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
            image: {
                title: 'Image',
                type: 'html'
            },
            name: {
                title: 'Name',
                type: 'html',
            },
            url: {
                title: 'URL',
                type: 'html',
            },
            created: {
                title: 'Created Date',
                type: 'string',
            },
            modified: {
                title: 'Modified Date',
                type: 'string',
            }
        },
    };

    source: LocalDataSource = new LocalDataSource();
    data = []
    slider: Slider[] = []
    services = new AdminUsersService()
    config = new AppConfig()
    closeResult = ''

    isAdd = false

    display_users = true

    button_pressed = false

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    model_image = ''
    model_name = ''
    model_url = 'https://'

    selectedCatID = ''

    constructor(private previewProgressSpinner: OverlayService, private http: HttpClient) {
    }

    getSliders() {
        firebase.firestore().collection('db').doc('votecad').collection('slider').onSnapshot(query => {
            this.data = []
            this.slider = []
            var index = 1
            query.forEach(data => {
                const s = <Slider>data.data()
                this.slider.push(s)
                this.data.push({ 'id': `${index}`, 'userID': s.id, 'url': `<a href="${s.url}" target="_blank">${s.name}</a>`, 'urlText':s.url, 'name':s.name, 'image': `<div class="card-profile-image1"><img src="${s.image}" class="rounded-circle"></div>`, 'img': s.image, 'created': s.created_date, 'modified': s.modified_date })
                index = index + 1
            })
            this.source.load(this.data)
        })
    }

    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getSliders()
        })
    }

    onValidationError(error: ValidationError) {
        if (error.error == FileValidationTypes.extensions) {
            this.config.displayMessage(`Validation Error: Incorrect file extension. Allowed extensions are: .jpg, .jpeg, .png`, false);
        } else if (error.error == FileValidationTypes.fileMaxSize) {
            this.config.displayMessage(`Validation Error: File size must not be greater than 300KB`, false);
        } else if (error.error == FileValidationTypes.fileMaxCount) {
            this.config.displayMessage(`Validation Error: Only one upload is allowed`, false);
        } else {
            this.config.displayMessage(`Validation Error: ${error.error}`, false);
        }
    }

    onFileAdded(file: FilePreviewModel) {
        myFiles.push(file);
    }

    addUser() {
        this.isAdd = true
        this.display_users = false
    }

    cancelAddUser() {
        this.display_users = true
        this.model_name = ''
        this.model_image = ''
        this.model_url = ''
        this.isAdd = true
        myFiles = []
        image_url = ''
        this.button_pressed = false
    }

    registerUser() {
        if (this.isAdd) {
            if (myFiles.length == 0) {
                this.config.displayMessage("Please enter all fields and select an image", false)
                return
            }
        }
        if (this.model_name == '' || this.model_url == '') {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }
        this.button_pressed = true
        const key = firebase.database().ref().push().key
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')

        const slider: Slider = {
            id: (this.isAdd) ? key : this.selectedCatID,
            name: this.model_name,
            image: image_url,
            url: this.model_url,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        if (this.isAdd) {
            slider.created_date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                slider.created_by = `${current_name}|${current_email}`,
                slider.timestamp = firebase.firestore.FieldValue.serverTimestamp()
            firebase.firestore().collection('db').doc('votecad').collection('slider').doc(key).set(slider).then(d => {
                this.config.logActivity(`${current_name}|${current_email} created this slider: ${this.model_name}`)
                this.config.displayMessage(`Slider created successfully.`, true);
                this.cancelAddUser()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            firebase.firestore().collection('db').doc('votecad').collection('slider').doc(this.selectedCatID).update(slider).then(d => {
                this.config.logActivity(`${current_name}|${current_email} updated this slider: ${this.model_name}`)
                // this.previewProgressSpinner.close()
                this.config.displayMessage(`Slider updated successfully.`, true);
                this.cancelAddUser()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        }
    }

    editUser(user: any) {
        this.selectedCatID = `${user.data.userID}`
        this.display_users = false
        this.isAdd = false
        this.model_name = user.data.name
        this.model_image = user.data.img
        this.model_url = user.data.urlText
        image_url = user.data.img
    }

    deleteUser(user: any) {
        const id = `${user.data.userID}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this slider?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('votecad').collection('slider').doc(id).delete().then(del => {
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
}

class DemoFilePickerAdapter extends FilePickerAdapter {
    constructor(private http: HttpClient) {
        super();
    }
    public uploadFile(fileItem: FilePreviewModel) {
        var UploadProgress = 0
        const file_extension = fileItem.fileName.substring(fileItem.fileName.lastIndexOf('.'))
        const key = firebase.database().ref().push().key
        var upload_task = firebase.storage().ref("sliders").child(`${key}${file_extension}`)
        const uploading = upload_task.put(fileItem.file)
        uploading.then(task => {
            upload_task.getDownloadURL().then(url => {
                image_url = url
            })
        })
        uploading.on('state_changed', (snapshot) => {
            UploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        })

        const form = new FormData();
        form.append('file', fileItem.file);
        const api = 'https://demo-file-uploader.free.beeceptor.com';
        const req = new HttpRequest('POST', api, form, { reportProgress: true });
        return this.http.request(req)
            .pipe(
                map((res: HttpEvent<any>) => {
                    if (res.type === HttpEventType.Response) {
                        return res.body.id.toString();
                    } else if (res.type === HttpEventType.UploadProgress) {
                        // Compute and show the % done:
                        // const UploadProgress = +Math.round((100 * res.loaded) / res.total);
                        return UploadProgress;
                    }
                })
            );
    }
    public removeFile(fileItem: FilePreviewModel): Observable<any> {
        for (var i = myFiles.length - 1; i--;) {
            if (myFiles[i] === fileItem) {
                myFiles.splice(i, 1)
                image_url = ''
            }
        }
        return of(true)
    }
}