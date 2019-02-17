import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {flatMap} from 'rxjs/operators';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlToUser = environment.host + environment.user;
  private urlToUnivers = environment.host + environment.univers;
  private urlToFaculties = environment.host + environment.faculties;
  private urlToGroups = environment.host + environment.groups;
  private uploadAvatar = environment.host + environment.uploadAvatar;
  public currentImageUrl: BehaviorSubject<string> = new  BehaviorSubject('');
  public saveProfile =  environment.host + environment.editProfile;
  public changePass = environment.host + environment.changePassword;
  public changeEm = environment.host + environment.changeEmail;
  public changePh = environment.host + environment.changePhone;
  public delAvatar = environment.host + environment.deletePhoto;
  public updPhone = environment.host + environment.updatePhone;

  constructor(private http: HttpClient,
              private authFire: AngularFireAuth) { }

  getUser () {
    return this.http.get(this.urlToUser);
  }
  getUnivers() {
    return this.http.get(this.urlToUnivers);
  }
  getFaculties(data = {}) {
    return this.http.post(this.urlToFaculties, data);
  }
  getGroups( data = null) {
    return this.http.post(this.urlToGroups, data);
  }

  deleteAvatar(data) {
    return this.http.post(this.delAvatar, data);
  }

  getAllInfo () {
    return forkJoin(
      this.http.get(this.urlToUser),
      this.http.get(this.urlToUnivers),
      this.http.post(this.urlToFaculties, {}),
      this.http.post(this.urlToGroups, {})
    );
  }

  uploadFile( file) {
    return this.http.post(this.uploadAvatar, {photo: file});
  }
  editProfile(form) {
    return this.http.post(this.saveProfile, form);
  }
  changePassword (form, oldPassword) {
      form.old_password = oldPassword;
    return this.http.post(this.changePass, form);
  }

  changePassFire (newPassword, oldPassword, authEmail) {
    return this.authFire.auth.signInWithEmailAndPassword(authEmail, oldPassword)
        .then((data: any) => {
          console.log('singIn');
          return data.user.updatePassword(newPassword);
    }).catch((e) => {throw e; } );
  }
  changeEmail (form) {
    return this.http.post(this.changeEm, form);
  }

  changePhone (form) {
    return this.http.post(this.changePh, form);
  }

  changeEmailFire (authEmail, pass, newEmail ) {
    return this.authFire.auth.signInWithEmailAndPassword(authEmail, pass)
      .then((data: any) => {
        console.log(data.user);
         return data.user.updateEmail(newEmail);
      })
      .catch((e) => {throw e; } );
  }

  getFireUser() {
    return this.authFire.auth.currentUser;
  }

  changePhoneFire (phone, appVerifier) {
    return this.authFire.auth.signInWithPhoneNumber(phone, appVerifier);
  }

  updatePhone (phone) {
   return this.http.post(this.updPhone, phone);
  }
}
