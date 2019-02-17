import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from '../../shared/services/register.service';
import {Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {st} from '@angular/core/src/render3';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;

  public message: string;
  public error: string;
  public email: string;
  public phone: string;

  formErrors: any = {
    'student_serial': '',
    'student_number': '',
    'password': '',
    'password_confirmation': '',
    'email' : '',
    'phone': ''
  };


  validationMessages: any = {

    'password': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.'

    },
    'phone' : {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 10 символов.',
    },
    'student_serial': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 2х символов.',
    },
    'student_number': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 8х символов.',
    },
    'email': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.',
      'email': 'Не правильный формат email адреса.'

    },
    'password_confirmation': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.'

    }
  };

  constructor(private fb: FormBuilder,
              private singUp: RegisterService,
              private router: Router,
              private user: UserService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      'student_serial': ['ВК', [Validators.required, Validators.minLength(2)]],
      'phone': ['0994267421', [Validators.required, Validators.minLength(10)]],
      'student_number': ['12345678', [Validators.required, Validators.minLength(8)]],
      'password' : ['111111', [Validators.required, Validators.minLength(6)]],
      'password_confirmation' : ['111111', [Validators.required, Validators.minLength(6)]],
      'email': ['kozedubdenis@gmail.com', [Validators.required,
        Validators.minLength(6),
        Validators.email
      ]],
    });

    this.registerForm.valueChanges
      .subscribe(data => this.onValueChange(data));
  }

  onValueChange (data?: any) {
    if (!this.registerForm) { return; }

    const form = this.registerForm;

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

  register() {
    this.singUp.register(this.registerForm.value)
      .subscribe(
        (r) => {
          if (r['message']) {
            if (r['message'].email) {
              swal('error', r['message'].email[0] , 'error');
            } else if (r['message'].phone) {
              swal('error', r['message'].phone[0], 'error');
           }
          } else if (r['registered']) {
            this.message = r['registered'];
           /* -----------------------------------*/
            this.singUp.registerFire(this.registerForm.value.email, this.registerForm.value.password)
              .then((r) => console.log(r))
              .catch((e) => console.log(e));
            /* -----------------------------------*/
            setTimeout(() => {
              this.message = '';
              this.router.navigateByUrl('/login');
            }, 8000);
          }
        } ,
        (e) => {
          swal('error', e.error.error , 'error');
        }
      );
  }

}
