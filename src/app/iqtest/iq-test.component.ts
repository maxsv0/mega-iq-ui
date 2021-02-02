import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TestTypeEnum} from '@/_models/enum';
import {IqTest} from '@/_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsConfig} from 'ngx-sharebuttons';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {isPlatformBrowser} from '@angular/common';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import {Subscription} from 'rxjs';
import firebase from 'firebase/app';

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
  private sub: Subscription;
  metaImage = 'https://img.mega-iq.com/g/about/img/bg-index.jpg';
  private currentUser: firebase.User = null;

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
    this.currentUser = this.authenticationService.currentUserValue;

    const testType = this.route.snapshot.params['testType'];
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      if (testType == null) {
          this.titleService.setTitle(this.i18n('Free IQ test on Mega-IQ'));
          const metaDescription = this.i18n('Start The IQ Test');
        this.updateMetaTags(this.titleService.getTitle(), this.router.url, metaDescription);
        this.setCustomShareButtonsConfig(this.metaImage, this.titleService.getTitle(), metaDescription);
      } else {
        this.testTypes.forEach((test) => {
          if (test.url === '/iqtest/' + testType) {
            this.testSelected = test;

            this.titleService.setTitle(this.i18n('{{name}} on Mega-IQ', {
              name: this.testSelected.name,
            }));
            this.updateMetaTags(this.titleService.getTitle(), this.router.url, this.testSelected.description);
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

    this.sub = this.route.params.subscribe(params => {
        this.testSelected = this.updateTest(params.testType);
    });

  }

  /**
   * @function startTest
   * @param type Test type enum
   * @description Gets selected test and navigates to classroom page
   */
    startTest(type: TestTypeEnum) {
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
                this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error.message);
                this.loading = false;
            });

        this.googleAnalyticsService.sendEvent('iq-test', 'start-test', type);
    }

  startTestBtn(type: TestTypeEnum): void {
    this.loading = true;

    if (!this.currentUser) {
      this.authenticationService.anonymousLogin()
        .then(user => {
          if (user.isAnonymous) {
            setTimeout(() => {
              this.startTest(type);
            }, 500);
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.startTestBtn(type);
          }, 500);
        });
      return;
    }
    this.startTest(type);
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

    private updateTest(paramType: string): IqTest {
        if (!this.testTypes) {
          return null;
        }
        if (this.testTypes.length) {
            let type: TestTypeEnum;
            switch (paramType) {
                case 'iq-practice':
                    type = TestTypeEnum.PRACTICE_IQ;
                    break;
                case 'iq-standard':
                    type = TestTypeEnum.STANDARD_IQ;
                    break;
                case 'mega-iq':
                    type = TestTypeEnum.MEGA_IQ;
                    break;
                case 'math':
                    type = TestTypeEnum.MATH;
                    break;
                case 'grammar':
                    type = TestTypeEnum.GRAMMAR;
                    break;
                case 'iq-kids':
                    type = TestTypeEnum.KIDS;
                    break;
            }
            for (let i = 0; i < this.testTypes.length; i++) {
                if (this.testTypes[i].type === type) {
                    this.titleService.setTitle(this.i18n('{{name}} on Mega-IQ', {name: this.testTypes[i].name}));
                    this.updateMetaTags(this.titleService.getTitle(), this.router.url, this.testTypes[i].description);
                    this.setCustomShareButtonsConfig(this.testTypes[i].pic, this.titleService.getTitle(), this.testTypes[i].description);
                    return this.testTypes[i];
                }
            }
        } else {
            return null;
        }
    }

    private updateMetaTags(title: string, url: string, description: string) {
        const tagsToUpdate = [
            {
                property: 'og:title',
                content: title
            },
            {
                property: 'og:url',
                content: url
            },
            {
                property: 'og:description',
                content: description
            },
            {
                property: 'og:image',
                content: this.metaImage
            }
        ];
        tagsToUpdate.forEach(tag => {
            this.metaService.updateTag({property: tag.property, content: tag.content});
        });
    }
}
