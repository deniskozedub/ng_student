import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../shared/services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {

  public changePass: FormGroup;
  public message: string = '';
  public userEmail: string;

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  formErrors: any = {
    'new_password': '',
    'new_password_confirmation' : '',

  };

  validationMessages: any = {
    'new_password': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.'

    },
    'new_password_confirmation': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.',
    }
  };

  ngOnInit() {
    this.buildForm();
    this.user.getUser().subscribe((r) => {
        this.userEmail = r['user']['email'];
      },
      (e) => console.log(e)
    );
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.new_password.value;
    const confirmPass = group.controls.new_password_confirmation.value;
      if (confirmPass.length) {
        return pass === confirmPass ? null : { notSame: true };
      }
  }


  buildForm() {
    this.changePass = this.fb.group({
      'new_password': ['', [Validators.required, Validators.minLength(6)]],
      'new_password_confirmation': ['', [Validators.required, Validators.minLength(6)]]

    }, { validator: this.checkPasswords });

    this.changePass.valueChanges
      .subscribe(data => this.onValueChange(data));
  }

  onValueChange (data?: any) {
    if (!this.changePass) { return; }

    const form = this.changePass;

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

  changePassword (form) {
    swal({
      title: 'Введите ваш текущий пароль.',
      input: 'password',
      inputOptions: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value !== '') {
            resolve();
          } else {
            resolve('Поле пустое !');
          }
        });
      }
    }).then((r) => {
      if (r.value) {
        this.user.changePassFire(form.value.new_password, r.value, this.userEmail)
          .then(() => {
            this.user.changePassword(form.value, r.value)
              .subscribe((res) => {
                  swal('Хорошо', res['success'], 'success');
                  this.router.navigateByUrl('/system/profile');
                },
                (e) => swal('error', e['message'], 'error'));
          }).catch((e) => {
          if (e.code === 'auth/wrong-password') {
            swal('Ошибка', 'Вы ввели не верный пароль!', 'error');
          } else {
            swal('error', ' Пока ошибка !', 'error');
          }
        });
      }
    });
  }
}
