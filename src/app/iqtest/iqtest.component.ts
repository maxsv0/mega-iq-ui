import { Component, OnInit } from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {ApiResponseTestResult, IqTest, User} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.scss']
})
export class IqTestComponent implements OnInit {
  testTypes: IqTest[] = [];
  testActive: IqTest;

  constructor(
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const testType = this.route.snapshot.params['testType'];

    this.initIqTests();

    this.testTypes.forEach(
      (test) => {
        if (test.url === '/iqtest/' + testType) {
          this.testActive = test;
        }
      }
    );
  }

  startTest(type: TestTypeEnum) {
    this.alertService.error('Error starting test type ' + type);

    this.iqTestService.startTest(type)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.router.navigate(['/']);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
        },
        error => {
          this.alertService.error(error);
        });
  }

  private initIqTests() {
    const iqTestPractice = new IqTest();
    iqTestPractice.type = TestTypeEnum.PRACTICE_IQ;
    iqTestPractice.name = 'Practice IQ Test';
    iqTestPractice.url = '/iqtest/iq-practice';
    iqTestPractice.pic = '/sssss.';
    this.testTypes.push(iqTestPractice);

    const iqTestStandart = new IqTest();
    iqTestStandart.type = TestTypeEnum.STANDART_IQ;
    iqTestStandart.name = 'Standart IQ Test';
    iqTestStandart.url = '/iqtest/iq-standard';
    iqTestStandart.pic = '/sssss.';
    this.testTypes.push(iqTestStandart);

    const iqTestMega = new IqTest();
    iqTestMega.type = TestTypeEnum.MEGA_IQ;
    iqTestMega.name = 'Mega IQ Test';
    iqTestMega.url = '/iqtest/mega-iq';
    iqTestMega.pic = '/sssss.';
    this.testTypes.push(iqTestMega);

    const iqTestMath = new IqTest();
    iqTestMath.type = TestTypeEnum.MATH;
    iqTestMath.name = 'Math IQ Test';
    iqTestMath.url = '/iqtest/math';
    iqTestMath.pic = '/sssss.';
    this.testTypes.push(iqTestMath);

    const iqTestGrammar = new IqTest();
    iqTestGrammar.type = TestTypeEnum.GRAMMAR;
    iqTestGrammar.name = 'Grammar IQ Test';
    iqTestGrammar.url = '/iqtest/grammar';
    iqTestGrammar.pic = '/sssss.';
    this.testTypes.push(iqTestGrammar);
  }
}
