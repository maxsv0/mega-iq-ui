import {Component, OnInit} from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {IqTest} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-iq-test',
  templateUrl: './iq-test.component.html',
  styleUrls: ['./iq-test.component.scss']
})
export class IqTestComponent implements OnInit {
  testTypes: IqTest[] = [];
  testSelected: IqTest;
  loading = false;

  constructor(
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    const testType = this.route.snapshot.params['testType'];

    this.testTypes = this.iqTestService.getIqTest();

    this.testTypes.forEach(
      (test) => {
        if (test.url === '/iqtest/' + testType) {
          this.testSelected = test;
        }
      }
    );
  }

  startTest(type: TestTypeEnum) {
    this.loading = true;
    this.iqTestService.startTest(type)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.router.navigate(['/classroom/' + apiResponseTestResult.test.code]);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
            this.loading = false;
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
          this.loading = false;
        });
  }
}
