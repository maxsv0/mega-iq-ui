import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqTestService} from './iqtest.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [
    IqTestService
  ]
})
export class IqTestModule {}
