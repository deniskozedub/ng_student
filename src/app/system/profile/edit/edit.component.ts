import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {debounceTime, map, mergeMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../shared/services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {fromEvent} from 'rxjs';
import swal from 'sweetalert2';
import {NotificationsService} from 'angular2-notifications';
import {ChatService} from '../../../shared/services/chat.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public currentUser;
  public allUnivers;
  public allFaculties;
  public allGroups;
  public editForm: FormGroup;
  public flag = false;
  public foundedFacultet: Array<string>  = [];
  public foundedGroup: Array<string>  = [];
  public selectedFile: string;
  public spinner = false;
  public changeForm = false;
  public message = '';
  public phoneCode: number;
  public phone: number;
  public serial = '';
  public studentNumber = '';
  public defaultAvatar = '';
  public flagIcon: boolean;


  formErrors: any = {
    'name': '',
    'surname': '',
    'email' : '',
    'phone': '',
    'student_id': '',
    'facultet' : '',
    'group' : ''

  };

  @ViewChild('facultet') facultet: ElementRef;
  @ViewChild('group') group: ElementRef;

  constructor(private user: UserService,
              private fb: FormBuilder,
              private ngxService: NgxUiLoaderService,
              private notificationsService: NotificationsService,
              private chatService: ChatService
  ) {}

  validationMessages: any = {
    'name': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 4х символов.'
    },
    'surname': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.'

    },
    'email': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 6х символов.',
      'email': 'Не правильный формат email адреса.'

    },
    'phone': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 10 символов.',
      'pattern': 'Значение должно соответвовать номеру телефона.'

    },
    'student_id': {
      'required': 'Обязательное поле.',
      'minlength': 'Значение должно быть не менее 8х символов.',
      'maxlength': 'Значение должно быть не более 8х символов.'

    },
    'facultet' : {
      'required': 'Обязательное поле.',
    },
    'group': {
      'required': 'Обязательное поле.',
    },
  };

  ngOnInit() {
    this.ngxService.start();
    this.user.getAllInfo()
      .subscribe(
        (r) => {
          this.currentUser  = r[0]['user'];
          this.checkName();
          this.chatService.connectToChat();
          this.allUnivers   = r[1]['univers'];
          this.allFaculties = r[2];
          this.allGroups    = r[3];
          this.defaultAvatar = r[0]['notAvatar'];
          this.buildForm();
          this.flag = true;
          if (this.currentUser.avatar) {
            this.user.currentImageUrl.next(this.currentUser.avatar.url);
            this.flagIcon = true;
          } else if (this.defaultAvatar) {
            this.user.currentImageUrl.next(this.defaultAvatar);
          } else {
            this.user.currentImageUrl.next('');
          }
          this.phoneCode = this.currentUser.phone.substring(0, 3);
          this.serial = this.currentUser.student_card.substring(0, 2);
          this.ngxService.stop();

        },
        (e) => console.log(e)
      );
  }


  buildForm() {
    this.editForm = this.fb.group({
      'name': [this.currentUser.name, [Validators.required]],
      'surname': [this.currentUser.surname, [Validators.required]],
      'student_serial': [this.currentUser.student_card.substring(3),
        [ Validators.required, Validators.minLength(8),
        Validators.maxLength(11)]],
      'facultet': [this.currentUser.facultet ? this.currentUser.facultet.name : 'Empty' , [Validators.required]],
      'group': [this.currentUser.group ? this.currentUser.group.name : 'Empty', [Validators.required]],
      'phone': [this.currentUser.phone.substring(3), [Validators.required, Validators.minLength(10)]],
      'email': [this.currentUser.email, [Validators.required, Validators.email]],
      'university': [this.currentUser.university_id ? this.currentUser.university_id : 1 , [Validators.required]],
    });

    this.editForm.get('facultet').valueChanges
      .subscribe((v) => {console.log(v); });
    this.editForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.editForm.valueChanges.subscribe((r) => {
      this.changeForm = true;
    });
  }
  facultyListener () {
    fromEvent(this.facultet.nativeElement, 'input')
      .pipe(
        /*pluck('target', 'value'),*/
        debounceTime(350),  /*задержка перед запросом*/
        map((v: any) => {
          return v.target.value;
        }),
        mergeMap((v)  => {
          const data = {name: v }
          ;
          return this.user.getFaculties(data);
        }),
        map((v: any) => {
          const  arData = [];
          v.facultet.forEach((e) => {
            arData.push(e.name);
          });
          this.foundedFacultet = arData;
        })
      )
      .subscribe((v) => {
      });
  }

  groupListener () {
    fromEvent(this.group.nativeElement, 'input')
      .pipe(
        /*pluck('target', 'value'),*/
        debounceTime(350),  /*задержка перед запросом*/
        map((v: any) => {
          return v.target.value;
        }),
        mergeMap((v)  => {
          const data = {name: v }
          ;
          return this.user.getGroups(data);
        }),
        map((v: any) => {
          const  arData = [];
          v.group.forEach((e) => {
            arData.push(e.name);
          });
          this.foundedGroup = arData;
        })
      )
      .subscribe((v) => {
      });
  }

  selectFacultet(item) {
    this.facultet.nativeElement.value = item;
    this.foundedFacultet.length = 0;
    this.editForm.get('facultet').setValue(item);
  }
  selectGroup(item) {
    this.group.nativeElement.value = item;
    this.foundedGroup.length = 0;
    this.editForm.get('group').setValue(item);
  }

  onValueChange (data?: any) {
    if (!this.editForm) { return; }

    const form = this.editForm;

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

  checkName () {
    let id = this.currentUser.id;
    let name = this.currentUser.name;
    let surname = this.currentUser.surname;

    if (name === 'nameless-' + id ) {
      this.notificationsService.warn('Предупреждение', 'Измените имя', {
        timeOut: 10000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        maxLength: 10
      });
    }
    if (surname === 'surnameless-' + id ) {
      this.notificationsService.warn('Предупреждение', 'Измените  фамилию', {
        timeOut: 10000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        maxLength: 10
      });
    }
  }

  uploadPhoto (e) {
    this.spinner = true;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = (e: any) => {
      this.selectedFile = e.target.result;
      this.user.uploadFile(this.selectedFile)
        .subscribe((r: any) => {
            this.user.currentImageUrl.next(r.link);
            this.spinner = false;
            this.flagIcon = true;
          },
          (er) => console.log(er));
    };
  }


  editProfile (form) {
    if (!this.changeForm) {
      return swal('Ошибка!', 'Вы не сделали ни одного изменения!', 'error');
    } else if (!form.valid) {
      return  swal('Ошибка!', 'Вы заполнили все поля!', 'error');
    }
    this.user.editProfile(form.value)
      .subscribe((r) =>  {
        swal('Хорошо!', 'Профиль обновлен', 'success');
        this.changeForm = false;
        },
        (e) => {console.log(e); });
  }


  deletePhoto () {
    const  data = {
      photo: 'delete'
    };
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    })

    swalWithBootstrapButtons({
      title: 'Вы уверены что хотите удалить аватар!?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Удалить!',
      cancelButtonText: 'Отмена!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.user.deleteAvatar(data).subscribe((r) => {
            this.user.currentImageUrl.next(this.defaultAvatar);
            this.flagIcon = false;
            swal('Хорошо', r['success'], 'success');
          },
          (e) => {
            swal('Ошибка!', e.error.error, 'error');
          }
        );
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons(
          ' Отмена!',
          '',
          'error'
        );
      }
    });

  }


}
