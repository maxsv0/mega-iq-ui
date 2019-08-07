import {Component, Inject} from '@angular/core';
import { LOCALE_ID } from '@angular/core';

import {ActivatedRoute, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest, User} from './_models';
import {Subscription} from 'rxjs';
import {TestTypeEnum} from '@/_models/enum';
import { __await } from 'tslib';

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
	loading: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private iqTestService: IqTestService,
		private authenticationService: AuthenticationService,
    @Inject(LOCALE_ID) public locale: string
	) 	{
		this.authenticationService.currentUser.subscribe(
		user => {
			this.currentUser = user;
		}

		if (this.locale.includes('-')) {
      this.locale = this.locale.substring(0, this.locale.indexOf('-'));
    }
);

	// load iq tests
    this.loadIqTest();

	router.events.subscribe((event) => {
	    if (event instanceof NavigationStart) {
            switch (event.url) {
                case '/iqtest/':
                    this.backgroundClass = event.url.substr(8);
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
		} catch(err) {
			alert(`An error occurred:${err}`);
			this.loading = false;
		}
	}

	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
    }
    
}
