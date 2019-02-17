import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule} from './app-routing.module';
import { AuthModule} from './auth/auth.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/common/header/header.component';
import { FooterComponent } from './shared/common/footer/footer.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './auth/jwt-interceptor';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {SpinnerModule} from 'angular2-spinner/dist';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment.prod';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    SpinnerModule,
    NgCircleProgressModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireAuthModule
  ],
  exports: [FormsModule, ReactiveFormsModule, NgCircleProgressModule, SpinnerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
