import {Component} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';

import {AuthenticationService, IqTestService} from './_services';
import {IqTest, User} from './_models';
import {Subscription} from 'rxjs';
import {TestTypeEnum} from '@/_models/enum';

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
		private authenticationService: AuthenticationService
	) 	{
		this.authenticationService.currentUser.subscribe(
		user => {
			this.currentUser = user;
		}
	);

	this.testTypes = this.iqTestService.getIqTest();

	router.events.subscribe((event) => {
	if (event instanceof NavigationStart) {
		if (event.url.startsWith('/iqtest/')) {
			this.backgroundClass = event.url.substr(8);
		} else if (event.url.startsWith('/classroom/')) {
			this.backgroundClass = '';
		// this.testTypes.forEach(
		//   (testType) => {
		//     if (test.type === testType.type) {
		//       this.backgroundClass = testType.styleName;
		//     }
		//   }
		// );
		} else if (!event.url.startsWith('/classroom/')) {
			this.backgroundClass = '';
		}
	}
	});
}

	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
	}
}
