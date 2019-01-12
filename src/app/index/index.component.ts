import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {first} from 'rxjs/operators';
import {AlertService, UserService} from '@/_services';
import {User} from '@/_models';
import * as $ from 'jquery';

declare var $: $;

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
    this.initJs();
  }

  ngOnInit() {
    this.loadUsersTop();
  }

  private initJs() {
    $(document).ready(function () {
      $('#counter').FlipClock(1000000, {
        clockFace: 'Counter',
        autoStart: true,
        minimumDigits: 7
      });
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
        this.alertService.error('API error: ' + error);
      });
  }
}
