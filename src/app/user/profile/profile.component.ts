import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User, ApiResponseUser} from '@/_models';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  user: Object;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.currentUser = this.authenticationService.currentUserValue;
    }
  }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];

    this.userService.getById(userId)
      .pipe(first())
      .subscribe(
        apiResponseUser => {
          if (apiResponseUser.ok) {
            this.user = apiResponseUser.user;
          } else {
            this.alertService.error(apiResponseUser.msg);
          }
        },
        error => {
          this.alertService.error(error);
        });
  }

}
