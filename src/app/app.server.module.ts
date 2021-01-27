import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {ServerDataModule} from './server-data.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerDataModule
  ],
  bootstrap: [AppComponent],
  providers: [
  ],
})
export class AppServerModule {
}

