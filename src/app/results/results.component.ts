import {Component, OnInit} from '@angular/core';
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
  isLoading = false;

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
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
