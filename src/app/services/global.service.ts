import swal from "sweetalert2";
import * as firebase from "firebase/app";
import 'firebase/firestore'
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class AppConfig {
    constructor() { }

    displayMessage(msg: string, success: boolean) {
        swal({
            title: msg,
            buttonsStyling: false,
            confirmButtonClass: (!success) ? "btn btn-danger" : "btn btn-success"
        }).catch(swal.noop)
    }

    logActivity(message: string) {
        const key = firebase.database().ref().push().key
        firebase.firestore().collection('db').doc('votecad').collection('logs').doc(key).set({
            'id': key,
            'log': message,
            'created_date': `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
            'timestamp': firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    createDynamicLink(http: HttpClient, title: string, desc: string, product_link: string, image_url: string) {
        const options = {
            "dynamicLinkInfo": {
                "domainUriPrefix": "votecad.page.link",
                "link": product_link,
                "navigationInfo": {
                    "enableForcedRedirect": true,
                },
                "socialMetaTagInfo": {
                    "socialTitle": title,
                    "socialDescription": desc,
                    "socialImageLink": image_url
                },
                "androidInfo": {
                    "androidPackageName": "com.taconline.giftshop"
                },
                "iosInfo": {
                    "iosBundleId": "com.taconline.giftshop"
                }
            },
            "suffix": {
                "option": "SHORT"
            }
        }
        return http.post("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDjqo31awRFXohoMYEiN13ondKu8d3nsH4", options, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).toPromise()
    }


    /**
     * Shorten number to thousands, millions, billions, etc.
     * http://en.wikipedia.org/wiki/Metric_prefix
     * http://stackoverflow.com/a/28608086
     *
     * @param {number} num Number to shorten.
     * @param {number} [digits=0] The number of digits to appear after the decimal point.
     * @returns {string|number}
     *
     * @example
     * shortenLargeNumber(12543, 1)
     * // returns '12.5k'
     *
     * @example
     * shortenLargeNumber(-12567)
     * // returns '-13k'
     *
     * @example
     * shortenLargeNumber(51000000)
     * // returns '51M'
     *
     * @example
     * shortenLargeNumber(651)
     * // returns 651
     *
     * @example
     * shortenLargeNumber(0.12345)
     * // returns 0.12345
     */
    shortenLargeNumber(num = 0, digits = 2) {
        const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        let decimal;

        for (let i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);

            if (num <= -decimal || num >= decimal) {
                return +(num / decimal).toFixed(digits) + units[i];
            }
        }

        return num;
    }

    formatNumbers(value: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        })
        return formatter.format(value)
    }

    async counterOperations(type: string, value: number) {
        const ref = firebase.firestore().collection('db').doc('votecad').collection('settings').doc('counter')
        if (type == 'amt') {//front-end
            await ref.update({ 'total_amt_generated': firebase.firestore.FieldValue.increment(value) })
        } else if (type == 'cont') {
            await ref.update({ 'total_contestants': firebase.firestore.FieldValue.increment(value) })
        } else if (type == 'evt') {
            await ref.update({ 'total_events': firebase.firestore.FieldValue.increment(value) })
        } else if (type == 'org') {
            await ref.update({ 'total_organizers': firebase.firestore.FieldValue.increment(value) })
        } else if (type == 'usr') {//front-end
            await ref.update({ 'total_users': firebase.firestore.FieldValue.increment(value) })
        }
        //  else { //front-end
        //     ref.update({'total_voting_credits': firebase.firestore.FieldValue.increment(value)})
        // }

    }
}
