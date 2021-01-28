import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApiResponseTests, ApiResponseUsersList, ApiResponseUsersTop, IqTest} from './_models';
import {TestTypeEnum} from '@/_models/enum';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {first} from 'rxjs/operators';
import {ApiResponsePublicTestResultList} from '@/_models/api-response-public-test-result-list';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
  ],
})
export class ServerDataModule {
  private testTypes = [];
  public testTypesSubscription: Observable<IqTest[]>;
  private testTypesSubject: BehaviorSubject<IqTest[]>;
  private activeTestType = new Subject<TestTypeEnum>();

  public userTop: ApiResponseUsersTop;
  public listLatest: ApiResponsePublicTestResultList;
  public userList: ApiResponseUsersList;

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
            }
          });
    }

    const userTop = localStorage.getItem('ServerDataModule/user/top');
    if (userTop) {
      this.userTop = JSON.parse(userTop);
    }

    const listLatest = localStorage.getItem('ServerDataModule/list-latest');
    if (listLatest) {
      this.listLatest = JSON.parse(listLatest);
    }

    const userList = localStorage.getItem('ServerDataModule/user/list');
    if (userList) {
      this.userList = JSON.parse(userList);
    }
  }

  public getType(): Observable<TestTypeEnum> {
    return this.activeTestType.asObservable();
  }

}
