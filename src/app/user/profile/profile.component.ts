import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User;

  @Input()
  user: User;

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
    if (this.user != null) {
      return;
    }

    const userId = this.route.snapshot.params['userId'];
    if (userId == null) {
      return;
    }

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
          this.alertService.error('API Service Unavailable. ' + error);
        });
  }
}
