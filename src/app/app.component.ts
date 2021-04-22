import {Component, Inject, PLATFORM_ID} from '@angular/core';

import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest} from './_models';
import {TestTypeEnum} from '@/_models/enum';
import {APP_LOCALE_ID} from '../environments/app-locale';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import {isPlatformBrowser, Location} from '@angular/common';
import firebase from 'firebase/app';

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
  testType = TestTypeEnum;
  testTypes: IqTest[] = [];
  loading = false;
  locale = APP_LOCALE_ID;
  isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
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
    // Only for browser
    if (this.isBrowser) {
      router.events.subscribe((event) => {
        // page loading is done
        if (event instanceof NavigationEnd) {
          /** Send GA page view event */
          this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);

          // scroll to top
          window.scrollTo(0, 0);
        }
      });
    }
  }

  /**
   * @function loadIqTest
   * @description Loads alls tests
   */
  loadIqTest() {
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;
      this.loading = false;
    });
  }

  /**
   * @function logout
   * @description Logs out current user
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

