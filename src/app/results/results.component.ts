import {Component, OnInit} from '@angular/core';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {PublicTestResult} from '@/_models/public-test-result';
import {IqTest} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {ActivatedRoute, ActivationStart, Router} from '@angular/router';

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
  countPerPage = 5;
  countPerAPIPage = 20;
  testsActive: PublicTestResult[] = [];
  tests: PublicTestResult[] = [];
  testsAll: PublicTestResult[] = [];
  isLoading = false;
  testTypes: IqTest[];
  testTypesKeys: [] = [];
  testsPageFirst = 0;
  testsPageCurrent = 0;
  testsPageAPICurrent = 0;
  testsPages: number[] = [];

  public testStatus = TestStatusEnum;
  public testTypeEnum = TestTypeEnum;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private iqTestService: IqTestService,
    private alertService: AlertService,
    private i18n: I18n,
  ) {
    this.titleService.setTitle(this.i18n('Top scores of IQ test on Mega-IQ'));
    const metaTitle = this.titleService.getTitle();
    const metaDescription = this.i18n('Every day thousands pass the online Mega-IQ test for free worldwide!');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:description', content: metaDescription});
    this.metaService.updateTag({property: 'og:url', content: '/iqtest/results'});

    this.router.events.subscribe(event => {
      if (event instanceof ActivationStart) {
        const params = event.snapshot.params;
        if (params && params['page']) {
          this.testsPageCurrent = +params['page'];
          this.testsPageAPICurrent = Math.floor((this.testsPageCurrent * this.countPerPage) / this.countPerAPIPage);
          this.testsPageFirst = Math.floor(this.testsPageAPICurrent * this.countPerAPIPage / this.countPerPage);

          console.log('testsPageFirst=' + this.testsPageFirst);
          console.log('testsPageCurrent=' + this.testsPageCurrent);
          console.log('testsPageAPICurrent=' + this.testsPageAPICurrent);
          this.filterForActivePage();
        }
      }
    });

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    if (this.route.snapshot.params['page']) {
      this.testsPageCurrent = +this.route.snapshot.params['page'];
      this.testsPageAPICurrent = Math.floor((this.testsPageCurrent * this.countPerPage) / this.countPerAPIPage);
      this.testsPageFirst = Math.floor(this.testsPageAPICurrent * this.countPerAPIPage / this.countPerPage);
      // if (this.testsPageFirst > 2) {
      //   this.testsPageFirst = this.testsPageFirst - 1;
      // }

      console.log('testsPageFirst=' + this.testsPageFirst);
      console.log('testsPageCurrent=' + this.testsPageCurrent);
      console.log('testsPageAPICurrent=' + this.testsPageAPICurrent);
    }

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
    this.iqTestService.getLatestResults(this.testsPageAPICurrent).pipe(first()).subscribe(
      apiResponsePublicTestResultList => {
        if (apiResponsePublicTestResultList.ok) {
          this.testsActive = apiResponsePublicTestResultList.testsActive;
          this.testsAll = this.testsAll.concat(apiResponsePublicTestResultList.tests);
          this.count = apiResponsePublicTestResultList.count;
          this.isLoading = false;
          console.log(this.testsAll);

          this.filterForActivePage();
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

  private filterForActivePage() {
    this.tests = [];
    this.testsPages = [];
    let pageNum = this.testsPageFirst;

    console.log('this.testsPageCurren=' + this.testsPageCurrent);

    for (let i = 0; i <= this.testsAll.length; i += this.countPerPage) {
      this.testsPages.push(pageNum);
      if (pageNum === this.testsPageCurrent) {
        console.log('pageNum=');
        console.log(pageNum);
        console.log(this.testsPageCurrent);
        console.log(this.testsAll.length);
        console.log((i + this.countPerPage < this.testsAll.length ? i + this.countPerPage : this.testsAll.length));
        console.log(i);

        for (let j = i; j < (i + this.countPerPage < this.testsAll.length ? i + this.countPerPage : this.testsAll.length); j++) {
          console.log('j=' + j);
          this.tests.push(this.testsAll[j]);
        }
      }
      pageNum++;
    }
    console.log(this.tests);

    // if (this.tests.length === 0) {
    //   this.testsPageAPICurrent++;
    //   console.log('will load somen!');
    //   console.log(this.testsPageAPICurrent);
    //   this.isLoading = true;
    //   this.loadUsersResults();
    // }
  }
}
