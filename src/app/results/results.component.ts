import {Component, OnInit} from '@angular/core';
import {AlertService, UserService} from '@/_services';
import {first} from 'rxjs/operators';
import {User} from '@/_models';
import {Title, Meta} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Router} from '@angular/router';

/**
 * @class ResultsComponent
 * @implements OnInit
 * @description Shows top users who passed test by ranking
 */
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n,
    private router: Router,
  ) {
    this.titleService.setTitle(this.i18n('Top scores of IQ test on Mega-IQ'));
    const metaTitle = this.titleService.getTitle();
    const metaDescription = this.i18n('Every day thousands pass the online Mega-IQ test for free worldwide!');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:description', content: metaDescription});
    this.metaService.updateTag({property: 'og:url', content: this.router.url});
    
    this.isLoading = true;
    this.loadUsersAll();
  }

  ngOnInit() {
  }

  /**
   * @function loadUsersAll
   * @description Get all users to show in ranking
   */
  private loadUsersAll() {
    this.userService.getAll().pipe(first()).subscribe(
      apiResponseUsersList => {
        if (apiResponseUsersList.ok) {
          this.users = apiResponseUsersList.users;
          this.isLoading = false;
        } else {
          this.alertService.error(apiResponseUsersList.msg);
          this.isLoading = false;
        }
      },
      error => {
        this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
        this.isLoading = false;
      });
  }
}
