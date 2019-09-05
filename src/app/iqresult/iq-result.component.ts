import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AlertService, IqTestService} from '@/_services';
import {IqTest, TestResult, User} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-iq-result',
  templateUrl: './iq-result.component.html',
  styleUrls: ['./iq-result.component.scss']
})
export class IqResultComponent implements OnInit {
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  test: TestResult;
  user: User;
  isLoading = false;
  isBrowser: boolean;

  constructor(
    private titleService: Title,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    const testCode = this.route.snapshot.params['testCode'];

    this.isLoading = true;

    this.iqTestService.getByCode(testCode)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            if (apiResponseTestResult.test.status === TestStatusEnum.ACTIVE) {
              this.router.navigate(['/classroom/' + apiResponseTestResult.test.code]);
            } else {
              this.test = apiResponseTestResult.test;
              this.user = apiResponseTestResult.user;

              this.setTitle(this.user.name,
                this.test.points,
                this.test.finishDate.toString(),
                this.test.type);
            }
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.isLoading = false;
        },
        error => {
          this.alertService.error('API Service Unavailable. ' + error);
          this.isLoading = false;
        });
  }

  ngOnInit() {
  }

  public setTitle(name: string, score: number, date: string, type: TestTypeEnum) {
    const testName = this.testTypes[this.testTypesKeys[type]].name;
    const testQuestions = this.testTypes[this.testTypesKeys[type]].questions;

    if (score != null) {
      switch (type) {
        case TestTypeEnum.MEGA_IQ:
        case TestTypeEnum.STANDARD_IQ:
          this.titleService.setTitle(this.i18n('IQ {{score}} {{test}} {{date}} {{name}}', {
            test: testName,
            name: name,
            score: score,
            date: date,
            location: location
          }));
          break;
        case TestTypeEnum.PRACTICE_IQ:
        case TestTypeEnum.MATH:
        case TestTypeEnum.GRAMMAR:
          this.titleService.setTitle(this.i18n('{{score}}/{{questions}} {{test}} {{date}} {{name}}', {
            test: testName,
            name: name,
            score: score,
            date: date,
            questions: testQuestions,
            location: location
          }));
          break;
      }
    } else {
      this.titleService.setTitle(this.i18n('{{test}} {{date}} {{name}}', {
        test: testName,
        name: name,
        date: date
      }));
    }
  }
}
