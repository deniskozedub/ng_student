import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HeadAuthComponent } from './login/head-auth/head-auth.component';
import { LoginPhoneComponent } from './login/login-phone/login-phone.component';
import { ButtonComponent } from './login/button/button.component';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [LoginComponent, RegistrationComponent, HeadAuthComponent, LoginPhoneComponent, ButtonComponent]
})
export class AuthModule { }
