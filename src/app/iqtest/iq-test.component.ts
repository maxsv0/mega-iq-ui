import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {IqTest} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {ShareButtonsConfig} from '@ngx-share/core';
import {isPlatformBrowser} from '@angular/common';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';

/**
 * @class IqTestComponent
 * @implements OnInit
 * @description Controller for iq test list page, user selects one test to start
 */
@Component({
  selector: 'app-iq-test',
  templateUrl: './iq-test.component.html',
  styleUrls: ['./iq-test.component.scss']
})
export class IqTestComponent implements OnInit {
  testTypes: IqTest[] = [];
  testSelected: IqTest;
  loading = false;
  isBrowser: boolean;
  customConfig: ShareButtonsConfig;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const testType = this.route.snapshot.params['testType'];
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      if (testType == null) {
        this.titleService.setTitle(this.i18n('Free IQ test on Mega-IQ'));
        const metaImage = 'https://img.mega-iq.com/g/about/img/bg-index.jpg';
        const metaDescription = this.i18n('Start The IQ Test');
        this.metaService.updateTag({property: 'og:title', content: this.titleService.getTitle()});
        this.metaService.updateTag({property: 'og:url', content: this.router.url});
        this.metaService.updateTag({property: 'og:image', content: metaImage});
        this.metaService.updateTag({property: 'og:description', content: metaDescription});

        this.setCustomShareButtonsConfig(metaImage, this.titleService.getTitle(), metaDescription);
      } else {
        this.testTypes.forEach((test) => {
          if (test.url === '/iqtest/' + testType) {
            this.testSelected = test;

            this.titleService.setTitle(this.i18n('{{name}} on Mega-IQ', {
              name: this.testSelected.name,
            }));

            this.metaService.updateTag({property: 'og:title', content: this.titleService.getTitle()});
            this.metaService.updateTag({property: 'og:url', content: this.router.url});
            this.metaService.updateTag({property: 'og:image', content: this.testSelected.pic});
            this.metaService.updateTag({property: 'og:description', content: this.testSelected.description});

            this.setCustomShareButtonsConfig(this.testSelected.pic, this.titleService.getTitle(), this.testSelected.description);
          }
        });
      }
    });
  }

  /**
   * @function ngOnInit
   * @description Send GA event when test is opened
   */
  ngOnInit() {
    if (this.testSelected != null) {
      this.googleAnalyticsService.sendEvent('iq-test', 'open-test', this.testSelected.type);
    } else {
      this.googleAnalyticsService.sendEvent('iq-test', 'open-test', 'all');
    }
  }

  /**
   * @function startTest
   * @param type Test type enum
   * @description Gets selected test and navigates to classroom page
   */
  startTest(type: TestTypeEnum) {
    this.loading = true;

    this.iqTestService.startTest(type)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.router.navigate(['/classroom/' + apiResponseTestResult.test.code]);

            // send GA event when test started
            this.googleAnalyticsService.sendEvent('iq-test', 'start-test', type);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
            this.loading = false;

            // send GA event if error
            this.googleAnalyticsService.sendEvent('iq-test', 'start-test-fail', type);
          }
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });

    this.googleAnalyticsService.sendEvent('iq-test', 'start-test', type);
  }

  /**
   * @function setCustomShareButtonsConfig
   * @description Sets custom configuration of share buttons
   */
  setCustomShareButtonsConfig(...options: any[]) {
    const [customImage, customTitle, customDescription] = options;
    this.customConfig = {
      image: customImage,
      title: customTitle,
      description: customDescription
    };
    ShareButtonsModule.withConfig(this.customConfig);
  }
}
