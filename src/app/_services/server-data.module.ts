import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApiResponseTests, IqTest} from '../_models';
import {TestTypeEnum} from '@/_models/enum';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {first} from 'rxjs/operators';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
})
export class ServerDataModule {
  private testTypes = [];
  public testTypesSubscription: Observable<IqTest[]>;
  private testTypesSubject: BehaviorSubject<IqTest[]>;
  private activeTestType = new Subject<TestTypeEnum>();

  constructor(
    private http: HttpClient
  ) {
    this.testTypesSubject = new BehaviorSubject<IqTest[]>(this.testTypes);
    this.testTypesSubscription = this.testTypesSubject.asObservable();

    const testData = localStorage.getItem('ServerDataModule/test');

    if (testData) {
      this.testTypes = JSON.parse(testData);
      this.testTypesSubject.next(this.testTypes);
    } else {
      this.http.get<ApiResponseTests>(environment.apiUrl + '/test')
        .pipe(first())
        .subscribe(
          apiResponseTests => {
            if (apiResponseTests.ok) {
              this.testTypes = apiResponseTests.tests;
              this.testTypesSubject.next(this.testTypes);

              localStorage.setItem('ServerDataModule/test', JSON.stringify(this.testTypes));
            }
          });
    }
  }

  public getType(): Observable<TestTypeEnum> {
    return this.activeTestType.asObservable();
  }

}
