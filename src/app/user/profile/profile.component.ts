import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '@/_services';
import {User} from '@/_models';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
    console.log(userId);

    this.userService.getById(userId).pipe(first()).subscribe(user => {
      this.user = user;
    });
    console.log(this.user);
  }

}
