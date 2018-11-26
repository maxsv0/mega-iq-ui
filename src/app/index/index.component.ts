import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {UserService} from '@/_services';
import {User} from '@/_models';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getTopToday().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }
}
