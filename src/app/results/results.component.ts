import {Component, OnInit} from '@angular/core';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {PublicTestResult} from '@/_models/public-test-result';
import {IqTest} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {ServerDataModule} from '@/server-data.module';

/**
 * @class ResultsComponent
 * @implements OnInit
 * @description Shows top users who passed test by ranking
 */
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  count = 0;
  testsActive: PublicTestResult[] = [];
  tests: PublicTestResult[] = [];
  isLoading = false;
  testTypes: IqTest[];
  testTypesKeys: [] = [];

  public testStatus = TestStatusEnum;
  public testTypeEnum = TestTypeEnum;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private iqTestService: IqTestService,
    private alertService: AlertService,
    private i18n: I18n,
    private serverDataModule: ServerDataModule
  ) {
    this.titleService.setTitle(this.i18n('Top scores of IQ test on Mega-IQ'));
    const metaTitle = this.titleService.getTitle();
    const metaDescription = this.i18n('Every day thousands pass the online Mega-IQ test for free worldwide!');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:description', content: metaDescription});
    this.metaService.updateTag({property: 'og:url', content: '/iqtest/results'});

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    this.isLoading = true;
    this.loadUsersResults();
  }

  ngOnInit() {
  }

  /**
   * @function loadUsersResults
   * @description Get latest iq tests results to show in ranking
   */
  private loadUsersResults() {
    if (this.serverDataModule.listLatest) {
      this.testsActive = this.serverDataModule.listLatest.testsActive;
      this.tests = this.serverDataModule.listLatest.tests;
      this.count = this.serverDataModule.listLatest.count;
      this.isLoading = false;
    } else {
      this.iqTestService.getLatestResults().pipe(first()).subscribe(
        apiResponsePublicTestResultList => {
          if (apiResponsePublicTestResultList.ok) {
            this.testsActive = apiResponsePublicTestResultList.testsActive;
            this.tests = apiResponsePublicTestResultList.tests;
            this.count = apiResponsePublicTestResultList.count;
            this.isLoading = false;
          } else {
            this.alertService.error(apiResponsePublicTestResultList.msg);
            this.isLoading = false;
          }
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.isLoading = false;
        });
    }
  }
}
