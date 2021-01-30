import {Component, OnInit} from '@angular/core';
import {User} from '@/_models';
import {Meta, Title} from '@angular/platform-browser';
import {AlertService, UserService} from '@/_services';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  count = 0;
  isLoading = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('Top scores of IQ test on Mega-IQ'));
    const metaTitle = this.titleService.getTitle();
    const metaDescription = this.i18n('Every day thousands pass the online Mega-IQ test for free worldwide!');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:description', content: metaDescription});
    this.metaService.updateTag({property: 'og:url', content: '/iqtest/users'});

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
    if (false) {
      // this.users = this.serverDataModule.userList.users;
      // this.count = this.serverDataModule.userList.count;
      // this.isLoading = false;
    } else {
      this.userService.getAll().pipe(first()).subscribe(
        apiResponseUsersList => {
          if (apiResponseUsersList.ok) {
            this.users = apiResponseUsersList.users;
            this.count = apiResponseUsersList.count;
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

}
