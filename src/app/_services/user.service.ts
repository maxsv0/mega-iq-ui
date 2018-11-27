import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getTopToday() {
    return this.http.get<User[]>(environment.apiUrl + '/users/today');
  }

  getAll() {
    return this.http.get<User[]>(environment.apiUrl + '/users/month');
  }

  getById(id: number) {
    return this.http.get(environment.apiUrl + `/users/${id}`);
  }

  register(user: User) {
    return this.http.post(environment.apiUrl + '/users/register', user);
  }

  forget(user: User) {
    return this.http.post(environment.apiUrl + '/users/forget', user);
  }

  update(user: User) {
    return this.http.put(environment.apiUrl + `/users/${user.id}`, user);
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + `/users/${id}`);
  }

  getAvatarsDefault() {
    return new Array(
      '/assets/user/avatar/pic1.jpg',
      '/assets/user/avatar/pic2.jpg',
      '/assets/user/avatar/pic3.jpg',
      '/assets/user/avatar/pic4.jpg',
      '/assets/user/avatar/pic5.jpg',
      '/assets/user/avatar/pic6.jpg',
      '/assets/user/avatar/pic7.jpg',
      '/assets/user/avatar/pic8.jpg',
      '/assets/user/avatar/pic9.jpg',
      '/assets/user/avatar/pic10.jpg'
    );
  }
}
