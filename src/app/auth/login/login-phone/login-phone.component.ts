import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.component.html',
  styleUrls: ['./login-phone.component.css']
})
export class LoginPhoneComponent implements OnInit {

  loginFormPhone: FormGroup;
  public message: string;

  formErrors: any = {
    'login': '',
    'password': ''
  };

  // Объект с сообщениями ошибок
  validationMessages: any = {
    'login': {
      'required': 'Обязательное поле.',
      'maxlength': 'Значение должно быть не более 10х символов.',

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

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  buildForm() {
    this.loginFormPhone = this.fb.group({
      'login': ['0994267421', [Validators.required,
        Validators.maxLength(10)
      ]],
      'password': ['111111', [Validators.required, Validators.minLength(6)]]
    });

    this.loginFormPhone.valueChanges
      .subscribe(data => this.onValueChange(data));
  }
  onValueChange (data?: any) {
    if (!this.loginFormPhone) { return; }

    const form = this.loginFormPhone;

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

  loginWithPhone(form) {
    this.auth.loginWithPhone(this.loginFormPhone.value)
      .subscribe(
        (r) => {
          localStorage.setItem('token', r['token']);
          this.auth.loginFire(r['email'], this.loginFormPhone.value.password)
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
