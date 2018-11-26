import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
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
    private userService: UserService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.currentUser = this.authenticationService.currentUserValue;
    }
  }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
    console.log(userId);

    this.userService.getById(userId).pipe(first()).subscribe(user => {
      this.user = user;
    });
    console.log(this.user);
  }

}
