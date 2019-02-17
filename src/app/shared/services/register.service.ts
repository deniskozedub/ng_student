import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseURL: string = environment.host + environment.register;

  constructor(private http: HttpClient,
              private router: Router,
              private authFire: AngularFireAuth
  ) { }

  register (data) {
    return this.http.post(this.baseURL, data);
  }
  registerFire (email, pass) {
    return this.authFire.auth.createUserWithEmailAndPassword(email, pass);
  }
}
