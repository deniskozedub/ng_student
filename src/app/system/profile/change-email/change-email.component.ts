import {Component,  HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../shared/services/user.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {

  public changeEmailForm: FormGroup;
  public message = '';
  public userEmail: string;
  public issetEmail: boolean;

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  formErrors: any = {
    'email': ''
  };

  validationMessages: any = {
    'email': {
      'required': 'Обязательное поле.',
      'email': 'Поле не соответвует типу email.'
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

  buildForm() {
    this.changeEmailForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],

    });
    this.changeEmailForm.valueChanges
      .subscribe(data => this.onValueChange(data));
  }

  onValueChange(data?: any) {
    if (!this.changeEmailForm) {
      return;
    }

    const form = this.changeEmailForm;

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

  confirmEmail() {
    if (this.userEmail === this.changeEmailForm.value.email) {
     return  this.issetEmail = true;
    } else {
      return this.issetEmail = false;
    }
  }
  changeEmail(form) {
    swal({
      title: 'Введите ваш пароль.',
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
        this.user.changeEmailFire(this.userEmail, r.value, form.value.email)
          .then(() => {
            this.user.changeEmail(form.value)
              .subscribe((res) => {
                  swal('success', res['message'], 'success');
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
