import {Component} from '@angular/core';

import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest, User} from './_models';
import {APP_LOCALE_ID} from '../environments/app-locale';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    googleAnalyticsService.appendGaTrackingCode();

    this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      });

    // load iq tests
    this.loadIqTest();

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case '/iqtest/iq-practice':
            this.backgroundClass = 'bg-iq-practice';
            break;
          case '/iqtest/iq-standard':
            this.backgroundClass = 'bg-iq-standard';
            break;
          case '/iqtest/mega-iq':
            this.backgroundClass = 'bg-mega-iq';
            break;
          case '/iqtest/math':
            this.backgroundClass = 'bg-math';
            break;
          case '/iqtest/grammar':
            this.backgroundClass = 'bg-grammar';
            break;
          case '/classroom/':
            this.backgroundClass = '';
            break;
          case '/':
            this.backgroundClass = 'home-image';
            break;
          default:
            this.backgroundClass = '';
            break;
        }
      }

      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);
      }
    });
  }

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

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
