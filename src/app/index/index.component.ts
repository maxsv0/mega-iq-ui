import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {first} from 'rxjs/operators';
import {AlertService, UserService} from '@/_services';
import {User} from '@/_models';
import * as $ from 'jquery';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss', './flipclock.css'],
  encapsulation: ViewEncapsulation.None,
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
    this.initJs();
  }

  private initJs() {
    $(document).ready(function () {
      // @ts-ignore
      const clock = new FlipClock($('#counter'), 1481981, {
        clockFace: 'Counter',
        minimumDigits: 7,
        autoStart: true,
        countdown: false
      });
      console.log(clock);
    });
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
        this.alertService.error('API Service Unavailable. ' + error);
      });
  }
}
