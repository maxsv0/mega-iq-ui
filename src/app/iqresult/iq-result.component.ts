import {Component, ElementRef, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {IqTest, TestResult, User} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Meta, Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {Chart} from 'chart.js';
import firebase from 'firebase/app';
import {APP_LOCALE_ID} from '../../environments/app-locale';
import {ShareButtonsConfig} from 'ngx-sharebuttons';

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
  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('myCanvasAnswers') myCanvasAnswers: ElementRef;
  public ctx: CanvasRenderingContext2D;
  public ctxAnswers: CanvasRenderingContext2D;
  testTypes: IqTest[] = [];
  testTypesToShow: IqTest[] = [];
  testTypesKeys: [] = [];
  test: TestResult;
  user: User;
  testNotFound = false;
  isLoading = false;
  isBrowser: boolean;
  chart: any;
  chartAnswers: any;
  testCode: string;
  hostName: string;
  testQuestionsCount = 0;
  testResultLevel = 0;  // from 0 (poor) to 5 (excellent)
  public testTypeEnum = TestTypeEnum;
  customConfig: ShareButtonsConfig;

  currentUser: firebase.User;

  constructor(
    public datepipe: DatePipe,
    private titleService: Title,
    private metaService: Meta,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private authenticationService: AuthenticationService,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

    let hostName = 'https://www.mega-iq.com';
    // @ts-ignore
    if (APP_LOCALE_ID === 'de') {
      hostName = 'https://de.mega-iq.com';
      // @ts-ignore
    } else if (APP_LOCALE_ID === 'es') {
      hostName = 'https://es.mega-iq.com';
      // @ts-ignore
    } else if (APP_LOCALE_ID === 'ru') {
      hostName = 'https://ru.mega-iq.com';
    }
    this.hostName = hostName;

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;
      this.testTypesToShow = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    this.testCode = this.route.snapshot.params['testCode'];

    this.isLoading = true;

    /** Get a selected test by test code **/
    this.iqTestService.getByCode(this.testCode)
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

              if (this.test.type === TestTypeEnum.MEGA_IQ || this.test.type === TestTypeEnum.STANDARD_IQ) {
                if (this.test.points > 155) {
                  this.testResultLevel = 5;
                } else if (this.test.points >= 150) {
                  this.testResultLevel = 4;
                } else if (this.test.points >= 140) {
                  this.testResultLevel = 3;
                } else if (this.test.points >= 120) {
                  this.testResultLevel = 2;
                } else if (this.test.points >= 100) {
                  this.testResultLevel = 1;
                }
              } else {
                const testQuestions = this.testTypes[this.testTypesKeys[this.test.type]].questions;
                const testResult = this.test.points / testQuestions;

                if (testResult > 0.95) {
                  this.testResultLevel = 5;
                } else if (testResult >= 0.9) {
                  this.testResultLevel = 4;
                } else if (testResult >= 0.8) {
                  this.testResultLevel = 3;
                } else if (testResult >= 0.7) {
                  this.testResultLevel = 2;
                } else if (testResult >= 0.5) {
                  this.testResultLevel = 1;
                }
              }

              const finishDate = this.datepipe.transform(this.test.finishDate, 'MMM d, y, h:mm:ss a');
              this.setMetaTags(
                this.test.points,
                finishDate,
                this.test.type);

              this.setCustomShareButtonsConfig(this.titleService.getTitle());

              let showIndex = 0;
              this.testTypesToShow = this.testTypes.filter(t => t.type === this.test.type);
              this.testTypesToShow.push(...this.testTypes.filter(t => t.type !== this.test.type && showIndex++ < 1));

              /** Draw chart js canvas **/
              if (this.test.type === TestTypeEnum.MEGA_IQ || this.test.type === TestTypeEnum.STANDARD_IQ) {
                // This is to fix ERROR Error: NotYetImplemented
                if (this.isBrowser) {
                  setTimeout(() => {
                    this.drawResultGraph();
                  }, 500);
                }
              }

              // This is to fix ERROR Error: NotYetImplemented
              if (this.isBrowser) {
                setTimeout(() => {
                  this.drawAnswersGraph();
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
          this.testNotFound = true;

          this.titleService.setTitle(this.i18n('Error 404. Test result not found.'));
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

  drawAnswersGraph() {
    if (this.test.answerInfo == null || this.test.answerInfo.length === 0) {
      return;
    }

    this.ctxAnswers = (<HTMLCanvasElement>this.myCanvasAnswers.nativeElement).getContext('2d');

    this.chartAnswers = new Chart(this.ctxAnswers, {
      type: 'bar',
      data: {
        labels: this.createLabelsForQuestions(),
        datasets: [{
          label: 'Question complexity',
          data: this.createPointForQuestions(),
          backgroundColor: this.createBackgroundColorForQuestions(),
          borderColor: this.createBorderColorForQuestions(),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  private createLabelsForQuestions(): string[] {
    const list: string[] = [];

    for (let i = 0; i < this.test.answerInfo.length; i++) {
      list.push('Question ' + (i + 1));
    }

    return list;
  }

  private createPointForQuestions(): number[] {
    const list: number[] = [];

    for (let i = 0; i < this.test.answerInfo.length; i++) {
      list.push(this.test.answerInfo[i].points);
    }

    return list;
  }

  private createBackgroundColorForQuestions(): string[] {
    const list: string[] = [];

    for (let i = 0; i < this.test.answerInfo.length; i++) {
      let color = '';

      if (!this.test.answerInfo[i].correct) {
        color = 'rgba(255, 99, 132, 0.2)';
      } else {
        color = 'rgb(75, 192, 155, 0.2)';
      }

      list.push(color);
    }

    return list;
  }

  private createBorderColorForQuestions(): string[] {
    const list: string[] = [];

    for (let i = 0; i < this.test.answerInfo.length; i++) {
      let color = '';

      if (!this.test.answerInfo[i].correct) {
        color = 'rgba(255, 99, 132, 1)';
      } else {
        color = 'rgb(44, 122, 36)';
      }

      list.push(color);
    }

    return list;
  }

  /**
   * @function setTitle
   * @param score Test score
   * @param date Test date
   * @param type Test type
   * @description Sets title for completed test result and i18n
   */
  public setMetaTags(score: number, date: string, type: TestTypeEnum) {
    const testName = this.testTypes[this.testTypesKeys[type]].name;
    const testQuestions = this.testTypes[this.testTypesKeys[type]].questions;
    const testPic = this.testTypes[this.testTypesKeys[type]].pic;

    if (score != null) {
      switch (type) {
        case TestTypeEnum.MEGA_IQ:
        case TestTypeEnum.STANDARD_IQ:
          this.titleService.setTitle(this.i18n('iq-result:meta:title:IQ {{score}} {{test}} {{date}}', {
            test: testName,
            score: score,
            date: date
          }));
          break;
        case TestTypeEnum.PRACTICE_IQ:
        case TestTypeEnum.MATH:
        case TestTypeEnum.GRAMMAR:
        case TestTypeEnum.KIDS:
          this.titleService.setTitle(this.i18n('iq-result:meta:title:{{score}}/{{questions}} {{test}} {{date}}', {
            test: testName,
            score: score,
            date: date,
            questions: testQuestions
          }));
          break;
      }
    } else {
      this.titleService.setTitle(this.i18n('iq-result:meta:title:{{test}} {{date}}', {
        test: testName,
        date: date
      }));
    }

    const description = this.i18n('iq-result:meta:description');

    this.metaService.updateTag({property: 'og:title', content: this.titleService.getTitle()});
    this.metaService.updateTag({property: 'og:description', content: description});
    this.metaService.updateTag({name: 'description', content: description});
    this.metaService.updateTag({property: 'og:image', content: testPic});
    this.metaService.updateTag({property: 'og:url', content: this.router.url});
  }

  setCustomShareButtonsConfig(titleOption) {
    this.customConfig = {
      title: titleOption,
      url: this.hostName + '/iqtest/result/' + this.testCode
    };
    ShareButtonsModule.withConfig(this.customConfig);
  }
}
