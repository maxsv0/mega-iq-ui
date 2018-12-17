import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { HomeComponent } from './user/home/home.component';
import { ProfileComponent } from './user/profile/profile.component';
import {SettingsComponent} from './user/settings/settings.component';
import {ForgetComponent} from './user/forget/forget.component';
import {ResultsComponent} from './results/results.component';
import {IqTestComponent} from './iqtest/iqtest.component';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget', component: ForgetComponent },
  { path: 'iqtest', component: IqTestComponent },
  { path: 'iqtest/results', component: ResultsComponent },
  { path: 'iqtest/:testType', component: IqTestComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user/:userId', component: ProfileComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
