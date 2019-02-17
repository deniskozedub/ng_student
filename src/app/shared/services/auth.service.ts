import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL: string = environment.host + environment.login;
  public loggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router,
              private authFire: AngularFireAuth) { }

  login(data) {
   return this.http.post(this.baseURL, data);
  }

  loginWithPhone (form) {
    return this.http.post(this.baseURL, form);
  }

  loginFirePhone (email, pass) {
    return this.authFire.auth.signInWithEmailAndPassword(email, pass);
  }

  loginFire (email, pass) {
    return this.authFire.auth.signInWithEmailAndPassword(email, pass);
  }

  logout() {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    })

    swalWithBootstrapButtons({
      title: 'Вы уверены что хотите выйти!?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Выйти!',
      cancelButtonText: 'Отмена!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem('token');
        this.authFire.auth.signOut().then(function() {
          swalWithBootstrapButtons(
            'Выход',
            'Вы вышли из сайта!',
            'success'
          );
        }).catch(function(error) {
          swalWithBootstrapButtons(
            ' Отмена!',
            'Вы остались на сайте!',
            'error'
          );
        });
        this.loggedIn = false;
        this.router.navigate(['login']);
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
      }
    });
  }
  getToken () {
    return localStorage.getItem('token');
  }
}
