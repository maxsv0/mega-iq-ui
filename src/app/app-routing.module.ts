import {RouterModule, Routes} from '@angular/router';

import {IndexComponent} from './index/index.component';
import {LoginComponent} from './user/login/login.component';
import {RegisterComponent} from './user/register/register.component';
import {HomeComponent} from './user/home/home.component';
import {SettingsComponent} from './user/settings/settings.component';
import {ForgetComponent} from './user/forget/forget.component';
import {PublicComponent} from './user/public/public.component';
import {ResultsComponent} from './results/results.component';
import {IqTestComponent} from './iqtest/iq-test.component';
import {IqResultComponent} from './iqresult/iq-result.component';
import {ClassroomComponent} from './classroom/classroom.component';
import {AuthGuard} from './_guards';
import {UsersComponent} from '@/users/users.component';
import {IqReviewComponent} from './iqreview/iq-review.component';
import {RegisteranonComponent} from './user/registeranon/registeranon.component';


const appRoutes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/anonymous', component: RegisteranonComponent},
  {path: 'forget', component: ForgetComponent},
  {path: 'iqtest', component: IqTestComponent},
  {path: 'iqtest/users', component: UsersComponent},
  {path: 'iqtest/results', component: ResultsComponent},
  {path: 'iqtest/:testType', component: IqTestComponent},
  {path: 'iqtest/result/:testCode', component: IqResultComponent},
  {path: 'iqtest/review/:testCode', component: IqReviewComponent},
  {path: 'classroom/:testCode', component: ClassroomComponent},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'settings/:verifyCode', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'user/:userId', component: PublicComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes, {
    initialNavigation: 'enabled'
});
