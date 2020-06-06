// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: "AIzaSyDjqo31awRFXohoMYEiN13ondKu8d3nsH4",
  authDomain: "votecadapp-899a5.firebaseapp.com",
  databaseURL: "https://votecadapp-899a5.firebaseio.com",
  projectId: "votecadapp-899a5",
  storageBucket: "votecadapp-899a5.appspot.com",
  messagingSenderId: "28840856472",
  appId: "1:28840856472:web:1fe4d8551f8ed563a639ed",
  measurementId: "G-XNTGCP2GRR"
};

export const environment = {
  production: false,
  firebase: firebaseConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
