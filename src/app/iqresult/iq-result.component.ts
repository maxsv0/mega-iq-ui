import {Component, ElementRef, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
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
import {Chart} from 'chart.js';

/**
 * @class IqResultComponent
 * @description Controller for IQ test results to be accessed via a completed test
 */
@Component({
  selector: 'app-iq-result',
  templateUrl: './iq-result.component.html',
  styleUrls: ['./iq-result.component.scss']
})
export class IqResultComponent {
  @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  test: TestResult;
  user: User;
  isLoading = false;
  isBrowser: boolean;
  chart: any;
  testQuestionsCount = 0;
  public testTypeEnum = TestTypeEnum;

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

    /** Get a selected test by test code **/
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

              this.testQuestionsCount = this.testTypes[this.testTypesKeys[this.test.type]].questions;

              this.setTitle(
                this.test.points,
                this.test.finishDate.toString(),
                this.test.type);

              /** Draw chart js canvas **/
              if (this.test.type === TestTypeEnum.MEGA_IQ || this.test.type === TestTypeEnum.STANDARD_IQ) {
                setTimeout(() => {
                  this.drawResultGraph();
                }, 1000);
              }
            }
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.isLoading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.isLoading = false;
        });
  }

  /**
   * @function drawResultGraph
   * @description Creates chart and config
   */
  drawResultGraph() {
    this.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.chart = new Chart(this.ctx, {
      type: 'radar',
      data: {
        datasets: [
          {
            data: [
              Number(this.test.groupsGraph.math.toFixed(2)),
              Number(this.test.groupsGraph.grammar.toFixed(2)),
              Number(this.test.groupsGraph.logic.toFixed(2)),
              Number(this.test.groupsGraph.horizons.toFixed(2))
            ]
          }
        ],
        labels: [
          this.i18n('Math'),
          this.i18n('Grammar'),
          this.i18n('Logic'),
          this.i18n('Horizons'),
        ]
      },
      options: {
        scale: {
          ticks: {
            stepSize: 10,
            beginAtZero: true,
            max: 100
          }
        },
        responsive: true,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
            }
          }
        },
        legend: {
          display: false
        }
      },
      plugins: [{
        beforeDraw: chart => {
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;
          ctx.restore();
          ctx.font = '48px Roboto';
          ctx.textBaseline = 'middle';
          const textIQ = (this.test.points != null) ? 'IQ ' + this.test.points.toString() : '';
          const textX = Math.round(width - ctx.measureText(textIQ).width);
          const textY = 50;

          ctx.fillText(textIQ, textX, textY);
          ctx.save();
        }
      }]
    });
  }

  /**
   * @function setTitle
   * @param score Test score
   * @param date Test date
   * @param type Test type
   * @description Sets title for completed test result and i18n
   */
  public setTitle(score: number, date: string, type: TestTypeEnum) {
    const testName = this.testTypes[this.testTypesKeys[type]].name;
    const testQuestions = this.testTypes[this.testTypesKeys[type]].questions;

    if (score != null) {
      switch (type) {
        case TestTypeEnum.MEGA_IQ:
        case TestTypeEnum.STANDARD_IQ:
          this.titleService.setTitle(this.i18n('IQ {{score}} {{test}} passed on {{date}}', {
            test: testName,
            score: score,
            date: date,
            location: location
          }));
          break;
        case TestTypeEnum.PRACTICE_IQ:
        case TestTypeEnum.MATH:
        case TestTypeEnum.GRAMMAR:
          this.titleService.setTitle(this.i18n('{{score}}/{{questions}} {{test}} passed on {{date}}', {
            test: testName,
            score: score,
            date: date,
            questions: testQuestions,
            location: location
          }));
          break;
      }
    } else {
      this.titleService.setTitle(this.i18n('{{test}} {{date}}', {
        test: testName,
        date: date
      }));
    }
  }
}
