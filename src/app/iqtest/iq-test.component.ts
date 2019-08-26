import {Component, OnInit} from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {IqTest} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';

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
    private titleService: Title,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private i18n: I18n
  ) {
  }

  ngOnInit() {
    const testType = this.route.snapshot.params['testType'];

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      this.titleService.setTitle(this.i18n('Free IQ test on Mega-IQ'));

      this.testTypes.forEach(
        (test) => {
          if (test.url === '/iqtest/' + testType) {
            this.testSelected = test;

            this.titleService.setTitle(this.i18n('{{name}} on Mega-IQ', {
              name: this.testSelected.name,
            }));
          }
        }
      );
    });
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
          this.alertService.error('API Service Unavailable. ' + error);
          this.loading = false;
        });
  }
}
