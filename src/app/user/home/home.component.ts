import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import {IqTest, TestResult, User} from '@/_models';
import {UserService, AuthenticationService, IqTestService, AlertService} from '@/_services';
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
      ([key, test]) =>  {
        this.testTypesKeys[test.type] = key;
      }
    );
    console.log(this.testTypesKeys);

    this.iqTestService.getMyAll()
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            this.userTests = apiResponseTestResultList.tests;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
        });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
}
