import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import {HeadAuthComponent} from './login/head-auth/head-auth.component';
import {LoginPhoneComponent} from './login/login-phone/login-phone.component';
import {ButtonComponent} from './login/button/button.component';


const routes: Routes = [
  { path: 'login', component: HeadAuthComponent, children: [
      { path: '', redirectTo: 'change-auth', pathMatch: 'full'},
      { path: 'change-auth', component: ButtonComponent},
      { path: 'with-email', component:  LoginComponent},
      { path: 'with-phone', component:  LoginPhoneComponent},
]},
  { path: 'registration', component: RegistrationComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
