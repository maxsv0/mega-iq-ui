import { Component, OnInit } from '@angular/core';
import {AlertService, UserService} from '@/_services';
import {first} from 'rxjs/operators';
import {User} from '@/_models';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  users: User[] = [];
  interval: number;

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadUsersAll();

    this.interval = setInterval(() => {
      this.loadUsersAll();
    }, 5000);
  }

  private loadUsersAll() {
    this.userService.getAll().pipe(first()).subscribe(
      apiResponseUsersList => {
        if (apiResponseUsersList.ok) {
          this.users = apiResponseUsersList.users;
        } else {
          this.alertService.error(apiResponseUsersList.msg);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
}
