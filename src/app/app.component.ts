import {Component, Inject, LOCALE_ID} from '@angular/core';

import {ActivatedRoute, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest, User} from './_models';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iqTestService: IqTestService,
    private authenticationService: AuthenticationService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      });

    if (this.locale.includes('-')) {
      this.locale = this.locale.substring(0, this.locale.indexOf('-'));
    }

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
      alert(`An error occurred:${err}`);
      this.loading = false;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
