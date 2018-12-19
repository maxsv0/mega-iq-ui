import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app-routing.module';

import { AlertComponent } from './_alert';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { HomeComponent } from './user/home/home.component';
import { ProfileComponent } from './user/profile/profile.component';
import { SettingsComponent } from './user/settings/settings.component';
import { ForgetComponent } from './user/forget/forget.component';
import { ResultsComponent } from './results/results.component';
import { IqTestComponent } from './iqtest/iq-test.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { IqResultComponent } from './iqresult/iq-result.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
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
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
