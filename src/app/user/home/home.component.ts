import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {TestResult, User} from '@/_models';
import {AlertService, AuthenticationService, IqTestService, UserService} from '@/_services';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {TestStatusEnum} from '@/_models/enum';

/**
 * @class HomeComponent
 * @implements OnInit, OnDestroy
 */
@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;
  userTests: TestResult[] = [];
  userTestsActive: TestResult[] = [];
  loading = false;
  isLoadingPage = true;
  isLoadingResults = false;
  isLastLoaded = false;
  userTestsPage = 0;

  constructor(
    private titleService: Title,
    private router: Router,
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));
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

  get deleteTestResultFunc() {
    return this.deleteTestResult.bind(this);
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

    // call for token request for user before calling API
    this.authenticationService.refreshIdTokenForCurrent();

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

    // call for token request for user before calling API
    this.authenticationService.refreshIdTokenForCurrent();

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

            // filter for current tests
            this.userTestsActive = this.userTests.filter(test => {
              return test.status === TestStatusEnum.ACTIVE;
            });

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

  deleteCertificate() {
    this.userService.deleteCertificate()
      .pipe(first())
      .subscribe(
        apiResponse => {
          if (apiResponse.ok) {
            this.currentUser.certificate = '';
            this.alertService.error(apiResponse.msg);
          }
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
