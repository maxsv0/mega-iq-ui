import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {AlertService, UserService} from '@/_services';
import {User} from '@/_models';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  usersTop: User[] = [];

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.loadUsersTop();
  }

  private loadUsersTop() {
    this.userService.getTop().pipe(first()).subscribe(
      apiResponseUsersList => {
        if (apiResponseUsersList.ok) {
          this.usersTop = apiResponseUsersList.users;
        } else {
          this.alertService.error(apiResponseUsersList.msg);
        }
      },
      error => {
        this.alertService.error('API error: ' + error);
      });
  }
}
