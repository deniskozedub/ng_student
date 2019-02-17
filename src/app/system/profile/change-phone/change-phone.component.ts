import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../shared/services/user.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.css']
})
export class ChangePhoneComponent implements OnInit {

  public changePhoneForm: FormGroup;
  public message = '';
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public recaptchaWidgetId: any;
  public userPhone: string;
  public issetPhone: boolean;

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  formErrors: any = {
    'phone': ''
  };

  validationMessages: any = {
    'phone': {
      'required': 'Обязательное поле.',
      'minlength': 'Поле содержит менее 10 симолов.',
      'maxlength': 'Поле содержит менее 13 симолов.'
    }
  };
  ngOnInit() {
    this.buildForm();

    this.user.getUser().subscribe((r) => {
        this.userPhone = r['user']['phone'].substring(3);
        console.log(this.userPhone);
      },
      (e) => console.log(e)
    );
  }

  buildForm() {
    this.changePhoneForm = this.fb.group({
      'phone': ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(13)]],

    });
    this.changePhoneForm.valueChanges
      .subscribe(data => this.onValueChange(data));
  }

  onValueChange (data?: any) {
    if (!this.changePhoneForm) { return; }

    const form = this.changePhoneForm;

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

  changePhone(form) {
    const self = this;
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': function(response) {
        self.user.changePhoneFire('+38' + form.value.phone, self.recaptchaVerifier)
          .then((confirmationResult) => {
            swal({
              title: 'Введите код!',
              input: 'text',
              inputPlaceholder: 'Введите код из смс!',
              inputOptions: {
                maxlength: '6',
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
            }).then((dataCode) => {
              const code = dataCode.value;
              confirmationResult.confirm(code)
                .then((data) => {
                /*  swal('success', '  Ваш код подтвержден!', 'success');*/
                  const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
                  self.user.updatePhone(form.value).subscribe((suc) => {
                      swal('success', '  Ваш телефон был изменен!', 'success');
                      self.router.navigateByUrl('/profile');
                  },
                    (e) => {
                      swal('error', 'Что-то пошло ни так!', 'error');
                    });
                })
                .catch((e) => {
                  swal('error', 'Не верный код!', 'error');
                });
            })
              .catch((e) => {console.log(e); });
          })
          .catch((e) => {
          });
      },
      'expired-callback': function(e) {
        console.log(e);
      }
    });
    this.recaptchaVerifier.render().then(function(widgetId) {
      self.recaptchaWidgetId = widgetId;
    });
  }

  confirmPnone() {
    if (this.userPhone === this.changePhoneForm.value.phone) {
      return this.issetPhone = true;
    } else {
      return this.issetPhone = false;
    }
  }

}
