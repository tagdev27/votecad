import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef, Input } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
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
import { People } from 'src/app/models/contestants';

var myFiles: FilePreviewModel[] = [];
var image_url = ''

@Component({
    template: `
  <label class="btn btn-info" data-toggle="tooltip" data-placement="bottom" title="{{renderValue}}">
  {{shortRenderValue}}
</label>
  `,
})

export class CustomEditorComponent implements ViewCell, OnInit {

    renderValue: string = '';
    shortRenderValue: string | number = ''
    config = new AppConfig()

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit() {
        this.renderValue = this.value.toString();
        this.shortRenderValue = this.config.shortenLargeNumber(Number(this.renderValue))
        // console.log(this.renderValue)
    }

}


@Component({
    selector: 'app-people',
    styleUrls: ['./people.component.scss'],
    templateUrl: './people.component.html',
})
export class PeopleComponent implements OnInit {

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
                title: 'Contestant Image',
                type: 'html'
            },
            name: {
                title: 'Name',
                type: 'string',
            },
            event: {
                title: 'Event',
                type: 'string',
            },
            vote: {
                title: 'Number of Votes',
                type: 'custom',
                renderComponent: CustomEditorComponent
            },
            avg: {
                title: 'Average Rating',
                type: 'string',
            },
            rating: {
                title: 'Total Ratings',
                type: 'custom',
                renderComponent: CustomEditorComponent
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
    people: People[] = []
    services = new AdminUsersService()
    config = new AppConfig()
    closeResult = ''

    isAdd = false

    display_users = true

    button_pressed = false

    main_user_id = 0
    main_user_type = ''//admin,agent,school
    main_user_role_type = ''//owner or staff

    qrcode_data = ''
    model_image = ''
    model_name = ''
    model_event = ''
    model_desc = ''
    model_facebook_url = 'https://'
    model_twitter_url = 'https://'
    model_instagram_url = 'https://'
    model_youtube_url = 'https://'
    model_tiktok_url = 'https://'
    model_video_urls: string[] = []
    model_more_info: any[] = []
    model_views = 0
    model_voting_count = 0
    model_vote_type = ''
    model_link = 0
    model_capped = 0

    editor(ev) {
        this.model_desc = ev
    }

    youtube_video_link = 'https://'
    more_info_title = ''
    more_info_value = ''

    selectedID = ''
    selectedPeople: People

    constructor(private previewProgressSpinner: OverlayService, private http: HttpClient) {
    }

    getShows() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('shows').orderBy('timestamp', 'desc').onSnapshot(query => {
                this.shows = []
                query.forEach(data => {
                    const s = <Show>data.data()
                    this.shows.push(s)
                })
            })
            this.getPeople()
            return
        }
        firebase.firestore().collection('shows').where('created_by', '==', this.main_user_id).orderBy('timestamp', 'desc').onSnapshot(query => {
            this.shows = []
            var index = 1
            query.forEach(data => {
                const s = <Show>data.data()
                this.shows.push(s)
            })
            this.getPeople()
        })
    }

    getPeople() {
        if (this.main_user_type == 'admin' && this.main_user_role_type == 'owner') {
            firebase.firestore().collection('contestants').orderBy('timestamp', 'desc').onSnapshot(query => {
                this.data = []
                this.people = []
                var index = 1
                query.forEach(data => {
                    const s = <People>data.data()
                    this.people.push(s)
                    this.data.push({ 'id': `${index}`, 'vote': `${s.voting_counts}`, 'event': this.getShowNameByID(s.event), 'userID': s.id, 'name': s.name, 'image': `<div class="card-profile-image1"><img src="${s.image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date, 'avg': `${s.avgRating}`, 'rating': `${s.numRatings}` })
                    index = index + 1
                })
                this.source.load(this.data)
            })
            return
        }
        firebase.firestore().collection('contestants').where('created_by', '==', this.main_user_id).orderBy('timestamp', 'desc').onSnapshot(query => {
            this.data = []
            this.people = []
            var index = 1
            query.forEach(data => {
                const s = <People>data.data()
                this.people.push(s)
                this.data.push({ 'id': `${index}`, 'vote': `${s.voting_counts}`, 'event': this.getShowNameByID(s.event), 'userID': s.id, 'name': s.name, 'image': `<div class="card-profile-image1"><img src="${s.image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date, 'avg': `${s.avgRating}`, 'rating': `${s.numRatings}` })
                index = index + 1
            })
            this.source.load(this.data)
        })
    }

    getShowNameByID(id: string) {
        const a = this.shows.filter((item, ind, arr) => {
            return item.id == id
        })
        return a[0].name
    }

    ngOnInit() {
        this.services.getUserData(localStorage.getItem('email')).then(user => {
            this.main_user_id = user.created_by
            this.main_user_type = user.user_type
            this.main_user_role_type = user.user_role_type
            this.getShows()
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
        this.qrcode_data = ''
        this.model_image = ''
        this.model_name = ''
        this.model_event = ''
        this.model_desc = ''
        this.model_facebook_url = 'https://'
        this.model_twitter_url = 'https://'
        this.model_instagram_url = 'https://'
        this.model_youtube_url = 'https://'
        this.model_tiktok_url = 'https://'
        this.model_video_urls = []
        this.model_more_info = []
        this.model_views = 0
        this.model_voting_count = 0
        this.model_vote_type = ''
        this.model_link = 0
        this.model_capped = 0
        this.isAdd = true
        myFiles = []
        image_url = ''
        this.selectedID = ''
        this.button_pressed = false
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async registerUser() {
        if (this.isAdd) {
            if (myFiles.length == 0) {
                this.config.displayMessage("Please enter all fields marked with * and upload images", false)
                return
            }
        }
        if (this.model_name == '' || this.model_event == '' || this.model_desc == '' || this.model_vote_type == '') {
            this.config.displayMessage("Please enter all fields marked with *.", false)
            return
        }
        if (this.model_vote_type == 'capped-per-day' || this.model_vote_type == 'total-vote-capped') {
            if (this.model_capped == 0 || this.model_capped == null) {
                this.config.displayMessage("Please enter number of capped vote.", false)
                return
            }
        }
        if (this.model_video_urls.length == 0) {
            this.config.displayMessage("Please add at least one youtube video link.", false)
            return
        }
        if (this.model_more_info.length == 0) {
            this.config.displayMessage("Please add at least one additional information.", false)
            return
        }
        this.button_pressed = true
        const key = firebase.database().ref().push().key

        const link = (this.isAdd) ? this.randomInt(1, 99999999999) : this.model_link

        const dynamic_link = await this.config.createDynamicLink(this.http, this.model_name, this.model_desc, `https://votecad.com/events/${this.getShowNameByID(this.model_event)}/contestant/${link}`, image_url)

        const people: People = {
            id: (this.isAdd) ? key : this.selectedID,
            name: this.model_name,
            image: image_url,
            event: this.model_event,
            description: this.model_desc,
            video_urls: this.model_video_urls,
            more_information: this.model_more_info,
            faceboook_page_url: this.model_facebook_url,
            twitter_page_url: this.model_twitter_url,
            instagram_page_url: this.model_instagram_url,
            youtube_page_url: this.model_youtube_url,
            tiktok_page_url: this.model_tiktok_url,
            views: (this.isAdd) ? 0 : this.model_views,
            vote_type: this.model_vote_type,
            capped_vote_number: this.model_capped,
            share_url: dynamic_link['shortLink'],
            voting_counts: (this.isAdd) ? 0 : this.model_voting_count,
            approved: true,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        if (this.isAdd) {
            people.avgRating = 0
            people.numRatings = 0
            people.link = link
            people.created_date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                people.created_by = this.main_user_id
            people.timestamp = firebase.firestore.FieldValue.serverTimestamp()
            firebase.firestore().collection('contestants').doc(key).set(people).then(d => {
                this.config.logActivity(`${this.current_name}|${this.current_email} created this contestant: ${this.model_name}`)
                this.config.counterOperations('cont', 1).then(d => {
                    this.config.createCounter(firebase.firestore().collection('contestants').doc(key), 10).then(d => {
                        this.config.displayMessage(`Contestants created successfully.`, true);
                        this.cancelAddUser()
                    })
                })
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            firebase.firestore().collection('contestants').doc(this.selectedID).update(people).then(d => {
                this.config.logActivity(`${this.current_name}|${this.current_email} updated this contestant: ${this.model_name}`)
                // this.previewProgressSpinner.close()
                this.config.displayMessage(`Contestants updated successfully.`, true);
                this.cancelAddUser()
            }).catch(err => {
                this.button_pressed = false
                this.config.displayMessage(`${err}`, false);
            })
        }
    }

    editUser(user: any) {
        this.selectedID = `${user.data.userID}`
        this.config.getCount(firebase.firestore().collection('contestants').doc(this.selectedID)).then(val => {
            console.log(val)
        })
        return
        // console.log(`start time === ${new Date().toLocaleTimeString()}`)

        // for(var i = 0; i <= 10000; i++){
        //     this.config.incrementCounter(firebase.firestore().collection('contestants').doc(this.selectedID), 8)
        //     if(i == 10000){
        //         console.log(`end time === ${new Date().toLocaleTimeString()}`)
        //     }
        // }
        // return
        const s = this.people.filter((item, index, arr) => {
            return item.id == this.selectedID
        })
        this.selectedPeople = s[0]
        this.display_users = false
        this.isAdd = false
        this.qrcode_data = this.selectedPeople.share_url
        image_url = this.selectedPeople.image
        this.model_name = this.selectedPeople.name
        this.model_event = this.selectedPeople.event
        this.model_desc = this.selectedPeople.description
        this.model_facebook_url = this.selectedPeople.faceboook_page_url
        this.model_twitter_url = this.selectedPeople.twitter_page_url
        this.model_instagram_url = this.selectedPeople.instagram_page_url
        this.model_youtube_url = this.selectedPeople.youtube_page_url
        this.model_tiktok_url = this.selectedPeople.tiktok_page_url
        this.model_video_urls = this.selectedPeople.video_urls
        this.model_more_info = this.selectedPeople.more_information
        this.model_views = this.selectedPeople.views
        this.model_voting_count = this.selectedPeople.voting_counts
        this.model_vote_type = this.selectedPeople.vote_type
        this.model_link = this.selectedPeople.link
        this.model_capped = this.selectedPeople.capped_vote_number
    }

    deleteUser(user: any) {
        const id = `${user.data.userID}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this contestant?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('contestants').doc(id).delete().then(del => {
                    this.config.logActivity(`${this.current_name}|${this.current_email} deleted this contestant: ${this.model_name}`)
                    this.config.counterOperations('cont', -1)
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

    addMoreInfo() {
        if (this.more_info_title == '' || this.more_info_value == '') {
            return
        }
        const info = { title: this.more_info_title, value: this.more_info_value }
        const check = this.model_more_info.filter((item, ind, arr) => {
            return item.title == this.more_info_title && item.value == this.more_info_value
        })
        if (check.length > 0) {
            this.config.displayMessage('Data added already', false)
            return
        }
        this.model_more_info.push(info)
        this.more_info_title = ''
        this.more_info_value = ''
    }

    removeMoreInfo(i: number) {
        this.model_more_info.splice(i, 1)
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
        var upload_task = firebase.storage().ref("contestants").child(`${key}${file_extension}`)
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