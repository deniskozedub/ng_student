import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import 'rxjs-compat/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private channel = 'chat:message';

  constructor(private socket: Socket,
              private http: HttpClient,
              private auth: AuthService) {}

  sendMessage(msg) {
    return this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket
      .fromEvent('message');
  }
  connectToChat() {
    return this.socket.emit('subscribe',  { 'channel': this.channel, 'token': this.auth.getToken()});
  }
  getAllMessage () {
    return  this.http.get(environment.host + environment.getChatWithMessages);
  }
}

