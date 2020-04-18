import {Component, Inject, PLATFORM_ID} from '@angular/core';

import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest} from './_models';
import {TestTypeEnum} from '@/_models/enum';
import {APP_LOCALE_ID} from '../environments/app-locale';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import {isPlatformBrowser} from '@angular/common';
import * as firebase from 'firebase';

/**
 * @class AppComponent
 * @description Main app component controller
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mega-iq-ui';
  currentUser: firebase.User;
  backgroundClass: string;
  testType = TestTypeEnum;
  testTypes: IqTest[] = [];
  loading = false;
  locale = APP_LOCALE_ID;
  isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      googleAnalyticsService.appendGaTrackingCode();
    }

    this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      });

    // load iq tests
    this.loadIqTest();

    // TODO: update not only bg, but also page title and styles
    /** Shows background color or image on respective route **/
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.setBackground(event.url);
      }

      // page loading is done
      if (event instanceof NavigationEnd) {
        /** Send GA page view event */
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);

        // scroll to top
        window.scrollTo(0, 0);
      }
    });
  }

  /**
   * @function loadIqTest
   * @description Loads alls tests
   */
  async loadIqTest() {
    this.loading = true;
    try {
      await this.iqTestService.getIqTest().subscribe(tests => {
        this.testTypes = tests;
      });
      this.loading = false;
    } catch (err) {
      this.loading = false;
    }
  }

  /**
   * @function setBackground
   * @param eventUrl Events based to url navigation
   * @description Set the background based on the URL the user is navigating
   * @returns Background class
   */
    private setBackground(eventUrl: string): string {
        if (eventUrl.startsWith('/classroom/')) {
            this.iqTestService.getType().subscribe(type => {
                switch (type) {
                    case this.testType.PRACTICE_IQ:
                        this.backgroundClass = 'bg-practice';
                        break;
                    case this.testType.STANDARD_IQ:
                        this.backgroundClass = 'bg-standard';
                        break;
                    case this.testType.MEGA_IQ:
                        this.backgroundClass = 'bg-megaiq';
                        break;
                    case this.testType.MATH:
                        this.backgroundClass = 'bg-math';
                        break;
                    case this.testType.GRAMMAR:
                        this.backgroundClass = 'bg-grammar';
                        break;
                }
            });
        } else {
            switch (eventUrl) {
                case '/iqtest/iq-practice':
                    this.backgroundClass = 'bg-practice';
                    break;
                case '/iqtest/iq-standard':
                    this.backgroundClass = 'bg-standard';
                    break;
                case '/iqtest/mega-iq':
                    this.backgroundClass = 'bg-megaiq';
                    break;
                case '/iqtest/math':
                    this.backgroundClass = 'bg-math';
                    break;
                case '/iqtest/grammar':
                    this.backgroundClass = 'bg-grammar';
                    break;
                case '/':
                    this.backgroundClass = 'home-image';
                    break;
                default:
                    this.backgroundClass = '';
                    break;
            }
        }
        return this.backgroundClass;
    }
}

