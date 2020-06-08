import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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
import Chart from 'chart.js';
// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
} from "../../variables/charts";

var myFiles: FilePreviewModel[] = [];
var background_image_url = ''
var thumbnail_url = ''
var selectedImageType = ''

import { ViewCell } from 'ng2-smart-table';
import { People } from 'src/app/models/contestants';
import { CustomQRCodeComponent } from 'src/app/components/qrcode/qrcode.component';


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
    selector: 'app-shows',
    styleUrls: ['./shows.component.scss'],
    templateUrl: './shows.component.html',
})
export class ShowsComponent implements OnInit, AfterViewInit {

    adapter = new DemoFilePickerAdapter(this.http);
    // @ViewChild(CustomEditorComponent) customStat;//:CustomEditorComponent = new CustomEditorComponent();

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
            deleteButtonContent: 'STATS',
            confirmDelete: true,
        },
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                type: 'number',
            },
            // qrcode: {
            //     title: 'QR Code',
            //     type: 'custom',
            //     renderComponent: CustomQRCodeComponent
            // },
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
                type: 'string',
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
            approved: {
                title: 'Approved',
                type: 'string',
            },
            verified: {
                title: 'Verified',
                type: 'string',
            },
            created: {
                title: 'Created Date',
                type: 'string',
            },
            modified: {
                title: 'Modified Date',
                type: 'string',
            }
            // stat: {
            //     title: 'View Stats',
            //     type: 'custom',
            //     renderComponent: CustomEditorComponent,
            // }
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

    qrcode_data = ''
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
    model_tiktok_url = 'https://'
    model_video_urls: string[] = []
    model_views = 0
    model_link = 0

    model_verified = 'false'
    model_approved = 'false'

    editor(ev) {
        this.model_desc = ev
    }

    youtube_video_link = 'https://'

    selectedID = ''
    selectedShow: Show

    viewStatChart = false

    ngAfterViewInit() {
        // console.log(typeof(this.customStat.eventStat))
        // const a = 
        // a.subscribe(val => {
        //     console.log(`tayo == ${val}`)
        // })
    }

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
                    this.data.push({ 'id': `${index}`, 'category': this.getCategoryNameByID(s.category), 'userID': s.id, 'name': s.name, 'pimage': `<div class="card-profile-image1"><img src="${s.thumbnail_image}" class="rounded-circle"></div>`, 'bimage': `<div class="card-profile-image1"><img src="${s.background_image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date, 'approved': `${s.approved}`, 'verified': `${s.verified}`, 'avg': `${s.avgRating}`, 'rating': `${s.numRatings}` })
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
                this.data.push({ 'id': `${index}`, 'category': this.getCategoryNameByID(s.category), 'userID': s.id, 'name': s.name, 'pimage': `<div class="card-profile-image1"><img src="${s.thumbnail_image}" class="rounded-circle"></div>`, 'bimage': `<div class="card-profile-image1"><img src="${s.background_image}" class="rounded-circle"></div>`, 'created': s.created_date, 'modified': s.modified_date, 'approved': `${s.approved}`, 'verified': `${s.verified}`, 'avg': `${s.avgRating}`, 'rating': `${s.numRatings}` })
                index = index + 1
            })
            this.source.load(this.data)
        })
    }

    getCategoryNameByID(id: string) {
        const a = this.category.filter((item, ind, arr) => {
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
        this.qrcode_data = ''
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
        this.model_tiktok_url = 'https://'
        this.model_approved = 'false'
        this.model_verified = 'false'
        this.model_video_urls = []
        this.model_views = 0
        this.model_link = 0
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

    async registerUser() {
        if (this.isAdd) {
            if (myFiles.length < 2) {
                this.config.displayMessage("Please enter all fields marked with * and upload images", false)
                return
            }
        }
        if (this.model_name == '' || this.model_category == '' || this.model_end_date == '' || this.model_desc == '') {
            this.config.displayMessage("Please enter all fields marked with *.", false)
            return
        }
        if (this.model_video_urls.length == 0) {
            this.config.displayMessage("Please add at least one youtube video link.", false)
            return
        }
        this.button_pressed = true
        const key = firebase.database().ref().push().key

        const link = (this.isAdd) ? this.randomInt(1, 99999999999) : this.model_link

        const dynamic_link = await this.config.createDynamicLink(this.http, this.model_name, this.model_desc, `https://votecad.com/events/${link}`, thumbnail_url)

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
            tiktok_page_url: this.model_tiktok_url,
            show_start_date: this.model_start_date,
            show_end_date: this.model_end_date,
            share_url: dynamic_link['shortLink'],
            views: (this.isAdd) ? 0 : this.model_views,
            approved: (this.model_approved == 'true') ? true : false,
            verified: (this.model_verified == 'true') ? true : false,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        if (this.isAdd) {
            show.voting_credit = 0
            show.avgRating = 0
            show.numRatings = 0
            show.link = link
            show.created_date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
            show.created_by = this.main_user_id
            show.timestamp = firebase.firestore.FieldValue.serverTimestamp()
            firebase.firestore().collection('shows').doc(key).set(show).then(d => {
                this.config.logActivity(`${this.current_name}|${this.current_email} created this show: ${this.model_name}`)
                this.config.counterOperations('evt', 1)
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
            return item.id == this.selectedID
        })
        this.selectedShow = s[0]
        this.display_users = false
        this.isAdd = false
        this.qrcode_data = this.selectedShow.share_url
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
        this.model_tiktok_url = this.selectedShow.tiktok_page_url
        this.model_approved = `${this.selectedShow.approved}`
        this.model_verified = `${this.selectedShow.verified}`
        this.model_video_urls = this.selectedShow.video_urls
        this.model_views = this.selectedShow.views
        this.model_link = this.selectedShow.link
    }

    closeChart(){
        this.viewStatChart = false
    }

    deleteUser(user: any) {
        const id = `${user.data.userID}`
        this.selected_event_name = user.data.name
        this.getPeopleByEventID(id)//'-M9AsKnZIttqgwNiKUCR')
        this.viewStatChart = true
        // swal({
        //     title: 'Delete Alert',
        //     text: 'Are you sure about deleting this show?',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, delete it!',
        //     cancelButtonText: 'No, keep it',
        //     confirmButtonClass: "btn btn-success",
        //     cancelButtonClass: "btn btn-danger",
        //     buttonsStyling: false
        // }).then((result) => {
        //     if (result.value) {
        //         firebase.firestore().collection('shows').doc(id).delete().then(del => {
        //             this.config.logActivity(`${this.current_name}|${this.current_email} deleted this show: ${this.model_name}`)
        //             this.config.displayMessage("Successfully deleted", true);
        //         }).catch(err => {
        //             this.config.displayMessage(`${err}`, false);
        //         })
        //     } else {
        //         swal({
        //             title: 'Cancelled',
        //             text: 'Deletion not successful',
        //             type: 'error',
        //             confirmButtonClass: "btn btn-info",
        //             buttonsStyling: false
        //         }).catch(swal.noop)
        //     }
        // })
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

    /**
     * chart section
     */
    people: People[] = []
    people_name: string[] = []
    people_vote_count: number[] = []

    selected_event_name = ''

    constestantChart = {
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (value) {
                                if (!(value % 10)) {
                                    //return '$' + value + 'k'
                                    return value;
                                }
                            }
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    label: function (item, data) {
                        var label = data.datasets[item.datasetIndex].label || "";
                        var yLabel = item.yLabel;
                        var content = "";
                        if (data.datasets.length > 1) {
                            content += label;
                        }
                        content += yLabel;
                        return content;
                    }
                }
            }
        },
        // data: {
        //   labels: ["Gisanrin Adetayo"],
        //   datasets: [
        //     {
        //       label: "Contestants",
        //       data: [1000]
        //     }
        //   ]
        // }
    }

    getPeopleByEventID(id: string) {
        firebase.firestore().collection('contestants').where('event', '==', id).get().then(query => {
            // this.people = []
            this.people_name = []
            this.people_vote_count = []
            var index = 0
            query.forEach(data => {
                const s = <People>data.data()
                // this.people.push(s)
                this.people_name.push(s.name)
                this.people_vote_count.push(s.voting_counts)
                index = index + 1
            })
            if (index == query.docs.length) {
                this.viewChart()
            }
        })
    }

    viewChart() {
        const myData = {
            labels: this.people_name,
            datasets: [
                {
                    label: "Contestants",
                    data: this.people_vote_count
                }
            ]
        }
        var chartOrders = document.getElementById('chart-orders');
        parseOptions(Chart, chartOptions())
        var ordersChart = new Chart(chartOrders, {
            type: 'bar',
            options: this.constestantChart.options,
            data: myData
        });
        // ordersChart.update();
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