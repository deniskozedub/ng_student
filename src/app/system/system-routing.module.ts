import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuardService} from '../shared/services/auth-guard.service';
import {EditComponent} from './profile/edit/edit.component';
import {ChangePassComponent} from './profile/change-pass/change-pass.component';
import {ChangeEmailComponent} from './profile/change-email/change-email.component';
import {ChangePhoneComponent} from './profile/change-phone/change-phone.component';
import {ChatComponent} from './chat-host/chat/chat.component';
import {SystemComponent} from './system.component';
import {HomeComponent} from './home/home.component';
import {ChatHostComponent} from './chat-host/chat-host.component';

const routes: Routes = [
  {path: '', component: SystemComponent, canActivate: [AuthGuardService], children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full'},
      { path: 'home', component: HomeComponent},
      { path: 'profile', component: ProfileComponent,  children: [
          { path: '', redirectTo: 'edit', pathMatch: 'full'},
          { path: 'edit', component: EditComponent},
          { path: 'change-password', component: ChangePassComponent},
          { path: 'change-email', component: ChangeEmailComponent},
          { path: 'change-phone', component: ChangePhoneComponent}
        ]
      },
      { path: 'chat', component: ChatHostComponent, canActivate: [AuthGuardService]}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
