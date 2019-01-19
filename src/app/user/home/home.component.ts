import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {IqTest, TestResult, User} from '@/_models';
import {AlertService, AuthenticationService, IqTestService, UserService} from '@/_services';
import {TestStatusEnum} from '@/_models/enum';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  userTests: TestResult[];
  loading = false;
  deletedId = null;
  public testStatus = TestStatusEnum;

  constructor(
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.testTypes = this.iqTestService.getIqTest();

    Object.entries(this.testTypes).forEach(
      ([key, test]) => {
        this.testTypesKeys[test.type] = key;
      }
    );

    this.loadMyResult();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  deleteTestResult(code: string) {
    this.loading = true;
    this.deletedId = code;

    this.iqTestService.deleteTestResult(code)
      .pipe(first())
      .subscribe(
        apiResponseBase => {
          if (apiResponseBase.ok) {
            this.alertService.success(apiResponseBase.msg);
          } else {
            this.alertService.error(apiResponseBase.msg);
          }
          this.loadMyResult();
        },
        error => {
          this.alertService.error('API Service Unavailable. ' + error);
        });
  }

  private loadMyResult() {
    this.iqTestService.getMyAll()
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            this.userTests = apiResponseTestResultList.tests;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }

          this.loading = false;
        },
        error => {
          this.alertService.error('API Service Unavailable. ' + error);
        });
  }
}
