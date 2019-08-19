import {Component, OnInit} from '@angular/core';
import {AlertService, UserService} from '@/_services';
import {first} from 'rxjs/operators';
import {User} from '@/_models';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

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
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('IQ test results on Mega-IQ'));
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadUsersAll();
  }

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
        this.alertService.error('API Service Unavailable. ' + error);
        this.isLoading = false;
      });
  }
}
