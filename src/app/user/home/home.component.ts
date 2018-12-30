import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import {IqTest, TestResult, User} from '@/_models';
import {UserService, AuthenticationService, IqTestService, AlertService} from '@/_services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  userTests: TestResult[];

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
