import {Component, Inject, OnInit, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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

@Component({
  selector: 'app-iq-result',
  templateUrl: './iq-result.component.html',
  styleUrls: ['./iq-result.component.scss']
})
export class IqResultComponent implements AfterViewInit {
    @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;
    public ctx: CanvasRenderingContext2D;
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  test: TestResult;
  user: User;
  isLoading = false;
  isBrowser: boolean;
  chart: any;
  testQuestions = null;
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

              this.setTitle(
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
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.isLoading = false;
        });
  }

  ngOnInit() {
  }

    ngAfterViewInit() {
        const self = this;
        setTimeout(() => {
            for(let i = 0; i < self.testTypes.length; i++) {
                if(self.testTypes[i].type === self.test.type) {
                    self.testQuestions = self.testTypes[i].questions;
                }
            }
            self.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
            self.chart = new Chart(self.ctx, {
                type: 'doughnut',
                data: {
                    datasets: [
                        {
                            data: [
                                Number(self.test.groupsGraph.math.toFixed(2)),
                                Number(self.test.groupsGraph.grammar.toFixed(2)),
                                Number(self.test.groupsGraph.logic.toFixed(2)), 
                                Number(self.test.groupsGraph.horizons.toFixed(2)),
                                Number((self.test.points / (self.testQuestions / 10)).toFixed(2))
                            ],
                            backgroundColor: [
                                '#6fb4b3',
                                '#87d987', 
                                '#7d8ac0', 
                                '#d3c1a9', 
                                '#e8c865'
                            ]
                        }
                    ],
                    labels: [
                        'Math',
                        'Grammar',
                        'Logic',
                        'Horizons',
                        'IQ Test Score Progress'
                    ]
                },
                options: {
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                            }
                        }
                    },
                    legend: {
                        labels: {
                            fontFamily: 'Roboto'
                        }
                    }
                }
            });
        },4000);
    }

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
