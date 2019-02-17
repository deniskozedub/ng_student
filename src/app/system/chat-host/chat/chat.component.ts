import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ChatService} from '../../../shared/services/chat.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../shared/services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {

  public chatForm: FormGroup;
  @Input() messages: Array<object>;
  @Input() activeUser;
  @Input() chatName;
  @Output() onMessage: EventEmitter<object> = new EventEmitter();
  public textarea: string;
  public count: string;
  @ViewChild ('chat') chatElem: ElementRef;

  constructor(private chatService: ChatService,
              private fb: FormBuilder,
              private user: UserService,
              private ngxService: NgxUiLoaderService) { }

  validationMessages: any = {
    'body': {
      'required': 'Обязательное поле'
    }
  };
  formErrors: any = {
    'body': ''
  };

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges () {
    if (this.chatElem && this.messages) {
      console.log(this.chatElem.nativeElement.children.length, this.messages);
    }
    if (this.messages) {
      this.scroll();
    }
  }


  private scroll(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1);
  }

  private getDiff(): number {
    if (!this.chatElem) {
      return -1;
    }

    const nativeElement = this.chatElem.nativeElement;
    return nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight);
  }

  private scrollToBottom(t = 1, b = 0): void {
    if (b < 1) {
      b = this.getDiff();
    }
    if (b > 0 && t <= 120) {
      setTimeout(() => {
        const diff = this.easeInOutSin(t / 120) * this.getDiff();
        this.chatElem.nativeElement.scrollTop += diff;
        this.scrollToBottom(++t, b);
      }, 1 / 60);
    }
  }

  private easeInOutSin(t): number {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }

  buildForm() {
    this.chatForm = this.fb.group({
      'body': ['', Validators.required]

    });
    this.chatForm.valueChanges
      .subscribe(data => this.onValueChange(data));
  }

  onValueChange (data?: any) {
    if (!this.chatForm) { return; }

    const form = this.chatForm;

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

  scrollToEndChat () {
    if (this.chatElem) {
      const chatHeight = this.chatElem.nativeElement.scrollHeight;
      this.chatElem.nativeElement.scrollTo(0, chatHeight);
      console.log(chatHeight);
    }
  }

  sendMessage() {
    const data = {
      'body': this.chatForm.get('body').value,
      'user_id': this.activeUser.id,
      'chat_id': this.activeUser.group.actual_chats[0].id
    };
      this.onMessage.emit(data);
      this.textarea = '';
  }

  getCount (count) {
    console.log(count);
  }

}
