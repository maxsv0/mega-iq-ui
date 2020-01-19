import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {IqTest} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Title, Meta} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {ShareButtonsConfig} from '@ngx-share/core';
import {isPlatformBrowser} from '@angular/common';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';

/**
 * @class IqTestComponent
 * @implements Oninit
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

        this.titleService.setTitle(this.i18n('Free IQ test on Mega-IQ'));

        this.testTypes.forEach((test) => {
            if (test.url === '/iqtest/' + testType) {
                this.testSelected = test;

                this.setCustomShareButtonsConfig(this.testSelected.pic);
                this.metaService.updateTag({property: 'og:image', content: this.testSelected.pic});
                this.metaService.updateTag({property: 'og:description', content: this.testSelected.description});
                this.titleService.setTitle(this.i18n('{{name}} on Mega-IQ', {
                    name: this.testSelected.name,
                }));
            }
        });
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
    const metaTitle = this.titleService.getTitle();
    const metaImage = 'https://storage.googleapis.com/mega-iq/about/img/bg-index.jpg';
    const metaDescription = this.i18n('Start The IQ Test');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:url', content: this.router.url});
    if(this.router.url === '/iqtest') {
        this.metaService.updateTag({property: 'og:image', content: metaImage});
        this.metaService.updateTag({property: 'og:description', content: metaDescription});
    }
    this.setCustomShareButtonsConfig(metaImage, metaTitle, metaDescription);
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
        }
        ShareButtonsModule.withConfig(this.customConfig);
    }
}
