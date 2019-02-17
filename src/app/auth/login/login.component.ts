import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {UserService} from '../../shared/services/user.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public message: string = '';

  formErrors: any = {
    'login': '',
    'password': ''
  };

  // Объект с сообщениями ошибок
  validationMessages: any = {
    'login': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.',
      'email': 'Не правильный формат email адреса.'

    },
    'password': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.'

    }
};
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private ngxService: NgxUiLoaderService
              ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      'login': ['kozedubdenis@gmail.com', [Validators.required,
        Validators.minLength(6)
      ]],
      'password': ['111111', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm.valueChanges
        .subscribe(data => this.onValueChange(data));
  }
  onValueChange (data?: any) {
    if (!this.loginForm) { return; }

    const form = this.loginForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const message = this.validationMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += message[key] + ' ';
            }
      }
    }

  }

/*  login*/

  login() {
    this.auth.login(this.loginForm.value)
      .subscribe(
        (r) => {
          localStorage.setItem('token', r['token']);
          this.auth.loginFire(this.loginForm.value.login, this.loginForm.value.password)
            .then((r) => {console.log(r)})
            .catch((e) => {console.log(e)})
          this.auth.loggedIn = true;
          this.router.navigateByUrl('/system');
        } ,
        (e) => {
          if (e['error']['message']) {
            swal('Ошибка!', e['error']['message'] + '!', 'error');
          }
        }
        );
  }



}
