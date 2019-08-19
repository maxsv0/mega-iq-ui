import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {IqTest, TestResult, User} from '@/_models';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

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
  isLoading = false;
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
  }

  ngOnInit() {
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    this.loadMyResult();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

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
            // this.alertService.success(apiResponseBase.msg);
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

  onScrollDown() {
    console.log('Load page ' + this.userTestsPage + '  scrolled down!!');

    this.loadMyResult();
  }


  private loadMyResult() {
    if (this.isLastLoaded) {
      return true;
    }

    this.isLoading = true;

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

            console.log('Load page ' + this.userTestsPage + '  load done!');
            this.userTestsPage++;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }

          this.isLoading = false;
        },
        error => {
          this.alertService.error(error);
          this.isLoading = false;
        });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
