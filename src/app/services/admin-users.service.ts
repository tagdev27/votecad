import * as firebase from "firebase/app";
import 'firebase/firestore'
import { AdminUsers } from "../models/admin.users";

export class AdminUsersService {

    constructor() { }
    user:AdminUsers = null;
    

    public async getUserData(email: string) {//firebase.firestore.DocumentSnapshot
        if (email == null) {
            return null;
        }
        const userSnap:firebase.firestore.DocumentSnapshot = await firebase.firestore().collection('db').doc('votecad').collection('users').doc(email).get();
        return <AdminUsers>userSnap.data()
    }

    public isAllowedAccess(access_level: string, menu: string) {
        if(access_level.includes(menu)){
            return true;
        }else {
            return false;
        }
    }

}