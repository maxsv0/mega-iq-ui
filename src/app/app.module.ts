import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {AppComponent} from './app.component';
import {routing} from './app-routing.module';

import {AlertComponent} from './_alert';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {IndexComponent} from './index/index.component';
import {LoginComponent} from './user/login/login.component';
import {RegisterComponent} from './user/register/register.component';
import {HomeComponent} from './user/home/home.component';
import {ProfileComponent} from './user/profile/profile.component';
import {SettingsComponent} from './user/settings/settings.component';
import {ForgetComponent} from './user/forget/forget.component';
import {ResultsComponent} from './results/results.component';
import {IqTestComponent} from './iqtest/iq-test.component';
import {ClassroomComponent} from './classroom/classroom.component';
import {IqResultComponent} from './iqresult/iq-result.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthenticationService} from '@/_services';
import {OwlModule} from 'ngx-owl-carousel';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'Mega-IQ'),
    AngularFireAuthModule,
    routing,
    OwlModule,
    InfiniteScrollModule
  ],
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AlertComponent,
    ProfileComponent,
    SettingsComponent,
    ForgetComponent,
    ResultsComponent,
    IqTestComponent,
    ClassroomComponent,
    IqResultComponent
  ],
  providers: [
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
