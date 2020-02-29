import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {IqTest, TestResult, User} from '@/_models';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

/**
 * @class HomeComponent
 * @implements OnInit, OnDestroy
 */
@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  userTests: TestResult[] = [];
  loading = false;
  isLoadingPage = true;
  isLoadingResults = false;
  isLastLoaded = false;
  deletedId = null;
  userTestsPage = 0;
  public testStatus = TestStatusEnum;
  public testTypeEnum = TestTypeEnum;

  constructor(
    private titleService: Title,
    private router: Router,
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });
  }

  /**
   * @function ngOnInit
   * @description Load User and Test data
   */
  ngOnInit() {
    this.loadMyResult();
  }

  /**
   * @function ngOnDestroy
   * @description Unsubscribe from current user on destroy
   */
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  /**
   * @function deleteTestResult
   * @param code Test code
   * @description Deletes test from user home
   */
  deleteTestResult(code: string) {
    if (!confirm('Are you sure you want to delete the test?')) {
      return false;
    }

    this.loading = true;
    this.deletedId = code;

    this.iqTestService.deleteTestResult(code)
      .pipe(first())
      .subscribe(
        apiResponseBase => {
          if (apiResponseBase.ok) {
            for (let i = 0; i < this.userTests.length; i++) {
              if (this.userTests[i].code === code) {
                this.userTests.splice(i, 1);
              }
            }
            this.alertService.success(apiResponseBase.msg);
          } else {
            this.alertService.error(apiResponseBase.msg);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  /**
   * @function onScrollDown
   * @description Loads more tests on scroll down
   */
  onScrollDown() {
    console.log('Load page ' + this.userTestsPage + '  scrolled down!!');

    this.loadMyResult();
  }


  /**
   * @function loadMyResult
   * @description Loads tests from user test API and sets title of user home
   */
  private loadMyResult() {
    if (this.isLastLoaded) {
      return true;
    }

    this.isLoadingResults = true;

    this.iqTestService.getMyAll(this.userTestsPage)
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            if (apiResponseTestResultList.tests.length < 8) {
              this.isLastLoaded = true;
            }

            this.userTests = this.userTests.concat(apiResponseTestResultList.tests);
            this.currentUser = apiResponseTestResultList.user;

            this.titleService.setTitle(this.i18n('{{name}} personal account', {name: this.currentUser.name}));

            this.userTestsPage++;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }

          this.isLoadingResults = false;
          this.isLoadingPage = false;
        },
        error => {
          this.alertService.error(error);
          this.isLoadingResults = false;
          this.isLoadingPage = false;
        });
  }

  /**
   * @function logout
   * @description Logs out current user
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
