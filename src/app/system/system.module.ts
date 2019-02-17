import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExploreImageDirective} from '../shared/common/directives/explore-image.directive';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {SpinnerModule} from 'angular2-spinner/dist';
import { EditComponent } from './profile/edit/edit.component';
import { ChangePassComponent } from './profile/change-pass/change-pass.component';
import { ChangeEmailComponent } from './profile/change-email/change-email.component';
import { ChangePhoneComponent } from './profile/change-phone/change-phone.component';
import { ChatComponent } from './chat-host/chat/chat.component';
import { SystemComponent } from './system.component';
import { HomeComponent } from './home/home.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {ChatService} from '../shared/services/chat.service';
import { ChatHostComponent } from './chat-host/chat-host.component';

const config: SocketIoConfig = { url: 'http://startup.beta:6001', options: {channel: 'chat:message'}};


@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgCircleProgressModule,
    SpinnerModule,
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    ProfileComponent,
    ExploreImageDirective,
    EditComponent,
    ChangePassComponent,
    ChangeEmailComponent,
    ChangePhoneComponent,
    ChatComponent,
    SystemComponent,
    HomeComponent,
    ChatHostComponent
  ],
  providers: [
    ChatService
  ]
})
export class SystemModule { }
