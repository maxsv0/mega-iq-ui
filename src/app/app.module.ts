import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {AppComponent} from './app.component';
import {routing} from './app-routing.module';

import {AlertComponent} from './_alert';
import {JwtInterceptor} from './_helpers';
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
import {PublicComponent} from './user/public/public.component';
import {AvatarComponent} from './user/avatar/avatar.component';
import {APP_LOCALE_ID} from '../environments/app-locale';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {shareButtonsIcons} from '@/icons';
import {TestcardComponent} from './user/testcard/testcard.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { UsersComponent } from './users/users.component';

declare const require; // Use the require method provided by webpack

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    LazyLoadImageModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'Mega-IQ'),
    AngularFireAuthModule,
    routing,
    OwlModule,
    InfiniteScrollModule,
    ShareButtonsModule
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
    IqResultComponent,
    PublicComponent,
    AvatarComponent,
    TestcardComponent,
    UsersComponent
  ],
  providers: [
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {
      provide: TRANSLATIONS,
      useFactory: (locale) => {
        locale = locale || 'en';
        return require(`raw-loader!../i18n/messages.${locale}.xlf`).default;
      },
      deps: [LOCALE_ID]
    },
    {
      provide: LOCALE_ID,
      useValue: APP_LOCALE_ID
    },
    {provide: TRANSLATIONS_FORMAT, useValue: 'xlf2'},
    I18n
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...shareButtonsIcons);
  }
}
