import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {UserService} from '../../shared/services/user.service';
import {ChatService} from '../../shared/services/chat.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.css']
})
export class ChatHostComponent implements OnInit {

  public activeUser;
  public chatName: string;
  public messages: Array<object>;
  public textarea: string;
  @ViewChild ('chat') chatElem: ElementRef;

  constructor(
    private chatService: ChatService,
    private user: UserService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.getChatWithMessages();
    this.user.getUser().subscribe((r) => {
        this.activeUser = r['user'];
      },
      (e) => {console.log(e); }
    );

    //this.chatService.connectToChat();

    this.chatService.getMessage().subscribe(
      (r) => {
        if (this.messages) {
          this.messages = this.messages.concat(r['message']);
          // this.messages.push(r['message']);
        }
      },
      (e) => {console.log(e); }
    );
  }


  getChatWithMessages() {
    this.chatService.getAllMessage().subscribe(
      (r) => {
        this.chatName = r['chat'][0].title;
        this.messages = r['chat'][0].messages;
      },
      (e) => {console.log(e); }
    );
  }
 sendMessage(data) {
    this.chatService.sendMessage(data);
  }

}
