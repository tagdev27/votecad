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
import { Show } from 'src/app/models/show';
import { Category } from 'src/app/models/category';

var myFiles: FilePreviewModel[] = [];
var background_image_url = ''
var thumbnail_url = ''
var selectedImageType = ''

@Component({
    selector: 'app-shows',
    styleUrls: ['./shows.component.scss'],
    templateUrl: './shows.component.html',
})
export class ShowsComponent implements OnInit {

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
            pimage: {
                title: 'Preview Image',
                type: 'html'
            },
            bimage: {
                title: 'Background Image',
                type: 'html'
            },
            name: {
                title: 'Name',
                type: 'string',
            },
            category: {
                title: 'Category',
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


    current_email = localStorage.getItem('email')
    current_name = localStorage.getItem('name')

    source: LocalDataSource = new LocalDataSource();
    data = []
    shows: Show[] = []
    category: Category[] = []
    services = new AdminUsersService()
    config = new AppConfig()
    closeResult = ''

    isAdd = false

    display_users = true

    button_pressed = false

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    model_pimage = ''
    model_bimage = ''
    model_name = ''
    model_category = ''
    model_start_date = ''
    model_end_date = ''
    model_desc = ''
    model_facebook_url = 'https://'
    model_twitter_url = 'https://'
    model_instagram_url = 'https://'
    model_youtube_url = 'https://'
    model_video_urls: string[] = []
    model_views = 0

    editor(ev) {
        this.model_desc = ev
    }

    youtube_video_link = 'https://'

    selectedID = ''
    selectedShow: Show

    constructor(private previewProgressSpinner: OverlayService, private http: HttpClient) {
    }

    getShows() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('shows').orderBy('timestamp', 'desc').onSnapshot(query => {
                this.data = []
                this.shows = []
                var index = 1
                query.forEach(data => {
                    const s = <Show>data.data()
                    this.shows.push(s)
                    this.data.push({ 'id': `${index}`, 'category':this.getCategoryNameByID(s.category), 'userID': s.id, 'name': s.name, 'pimage': `<div class="card-profile-image1"><img src="${s.thumbnail_image}" class="rounded-circle"></div>`, 'bimage': `<div class="card-profile-image1"><img src="${s.background_image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date })
                    index = index + 1
                })
                this.source.load(this.data)
            })
            return
        }
        firebase.firestore().collection('shows').where('created_by', '==', this.main_user_id).orderBy('timestamp', 'desc').onSnapshot(query => {
            this.data = []
            this.shows = []
            var index = 1
            query.forEach(data => {
                const s = <Show>data.data()
                this.shows.push(s)
                this.data.push({ 'id': `${index}`, 'category':this.getCategoryNameByID(s.category), 'userID': s.id, 'name': s.name, 'pimage': `<div class="card-profile-image1"><img src="${s.thumbnail_image}" class="rounded-circle"></div>`, 'bimage': `<div class="card-profile-image1"><img src="${s.background_image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date })
                index = index + 1
            })
            this.source.load(this.data)
        })
    }

    getCategoryNameByID(id:string){
        const a = this.category.filter((item,ind,arr)=>{
            return item.id == id
        })
        return a[0].name
    }

    getCategory() {
        firebase.firestore().collection('db').doc('votecad').collection('category').orderBy('name', 'asc').get().then(query => {
            this.category = []
            query.forEach(data => {
                const cat = <Category>data.data()
                this.category.push(cat)
            })
            this.getShows()
        })
    }

    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getCategory()
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

    onFileAdded(file: FilePreviewModel, type: string) {
        myFiles.push(file);
        selectedImageType = type
    }

    addUser() {
        this.isAdd = true
        this.display_users = false
    }

    cancelAddUser() {
        this.display_users = true
        this.model_pimage = ''
        this.model_bimage = ''
        this.model_name = ''
        this.model_category = ''
        this.model_start_date = ''
        this.model_end_date = ''
        this.model_desc = ''
        this.model_facebook_url = 'https://'
        this.model_twitter_url = 'https://'
        this.model_instagram_url = 'https://'
        this.model_youtube_url = 'https://'
        this.model_video_urls = []
        this.model_views = 0
        this.isAdd = true
        myFiles = []
        background_image_url = ''
        thumbnail_url = ''
        selectedImageType = ''
        this.selectedID = ''
        this.button_pressed = false
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    registerUser() {
        if (this.isAdd) {
            if (myFiles.length < 2) {
                this.config.displayMessage("Please enter all fields markedd with * and upload images", false)
                return
            }
        }
        if (this.model_name == '' || this.model_category == '' || this.model_end_date == '' || this.model_desc == '') {
            this.config.displayMessage("Please enter all fields markedd with *.", false)
            return
        }
        if (this.model_video_urls.length == 0) {
            this.config.displayMessage("Please add at least one youtube video link.", false)
            return
        }
        this.button_pressed = true
        const key = firebase.database().ref().push().key

        const show: Show = {
            id: (this.isAdd) ? key : this.selectedID,
            name: this.model_name,
            background_image: background_image_url,
            thumbnail_image: thumbnail_url,
            category: this.model_category,
            description: this.model_desc,
            video_urls: this.model_video_urls,
            faceboook_page_url: this.model_facebook_url,
            twitter_page_url: this.model_twitter_url,
            instagram_page_url: this.model_instagram_url,
            youtube_page_url: this.model_youtube_url,
            show_start_date: this.model_start_date,
            show_end_date: this.model_end_date,
            views: (this.isAdd) ? 0 : this.model_views,
            approved: true,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        if (this.isAdd) {
            show.link = this.randomInt(1, 9999999999)
            show.created_date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                show.created_by = this.main_user_id
            show.timestamp = firebase.firestore.FieldValue.serverTimestamp()
            firebase.firestore().collection('shows').doc(key).set(show).then(d => {
                this.config.logActivity(`${this.current_name}|${this.current_email} created this show: ${this.model_name}`)
                this.config.displayMessage(`Event created successfully.`, true);
                this.cancelAddUser()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            firebase.firestore().collection('shows').doc(this.selectedID).update(show).then(d => {
                this.config.logActivity(`${this.current_name}|${this.current_email} updated this show: ${this.model_name}`)
                // this.previewProgressSpinner.close()
                this.config.displayMessage(`Event updated successfully.`, true);
                this.cancelAddUser()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        }
    }

    editUser(user: any) {
        this.selectedID = `${user.data.userID}`
        const s = this.shows.filter((item, index, arr) => {
            return item.id = this.selectedID
        })
        this.selectedShow = s[0]
        this.display_users = false
        this.isAdd = false
        background_image_url = this.selectedShow.background_image
        thumbnail_url = this.selectedShow.thumbnail_image
        this.model_pimage = this.selectedShow.thumbnail_image
        this.model_bimage = this.selectedShow.background_image
        this.model_name = this.selectedShow.name
        this.model_category = this.selectedShow.category
        this.model_start_date = this.selectedShow.show_start_date
        this.model_end_date = this.selectedShow.show_end_date
        this.model_desc = this.selectedShow.description
        this.model_facebook_url = this.selectedShow.faceboook_page_url
        this.model_twitter_url = this.selectedShow.twitter_page_url
        this.model_instagram_url = this.selectedShow.instagram_page_url
        this.model_youtube_url = this.selectedShow.youtube_page_url
        this.model_video_urls = this.selectedShow.video_urls
        this.model_views = this.selectedShow.views
    }

    deleteUser(user: any) {
        const id = `${user.data.userID}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this show?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('shows').doc(id).delete().then(del => {
                    this.config.logActivity(`${this.current_name}|${this.current_email} deleted this show: ${this.model_name}`)
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

    addVideoLink() {
        if (this.youtube_video_link == '') {
            return
        }
        if (this.model_video_urls.includes(this.youtube_video_link)) {
            this.config.displayMessage('Link added already', false)
            return
        }
        this.model_video_urls.push(this.youtube_video_link)
        this.youtube_video_link = 'https://'
    }

    removeLink(i: number) {
        this.model_video_urls.splice(i, 1)
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
        var upload_task = null
        if (selectedImageType == 'background') {
            upload_task = firebase.storage().ref("shows/background").child(`${key}${file_extension}`)
        } else if (selectedImageType == 'thumb') {
            upload_task = firebase.storage().ref("shows/thumbnail").child(`${key}${file_extension}`)
        }
        const uploading = upload_task.put(fileItem.file)
        uploading.then(task => {
            upload_task.getDownloadURL().then(url => {
                if (selectedImageType == 'background') {
                    background_image_url = url
                } else if (selectedImageType == 'thumb') {
                    thumbnail_url = url
                }
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
                if (selectedImageType == 'background') {
                    background_image_url = ''
                } else if (selectedImageType == 'thumb') {
                    thumbnail_url = ''
                }
            }
        }
        return of(true)
    }
}