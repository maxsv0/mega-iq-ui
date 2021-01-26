import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {IqTestModule} from './_services/iq-test.module';

@NgModule({
  imports: [
    AppModule,
    IqTestModule,
    ServerModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
}

