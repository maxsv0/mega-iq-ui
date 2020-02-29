import {Component, Inject, PLATFORM_ID} from '@angular/core';

import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest, User} from './_models';
import {APP_LOCALE_ID} from '../environments/app-locale';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import {isPlatformBrowser} from '@angular/common';

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
  currentUser: User;
  backgroundClass: string;
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
        if (event.url.startsWith('/classroom/')) {
          // TODO: style should be dependent on test type
          this.backgroundClass = 'bg-megaiq';
        } else {
          switch (event.url) {
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
      }

      /** Send GA page view event */
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);
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
}
