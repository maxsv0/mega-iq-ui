import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {User, ApiResponseUser, ApiResponseUsersList} from '@/_models';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getTop() {
    return this.http.get<ApiResponseUsersList>(environment.apiUrl + '/user/top');
  }

  getAll() {
    return this.http.get<ApiResponseUsersList>(environment.apiUrl + '/user/list');
  }

  getById(id: number) {
    return this.http.get<ApiResponseUser>(environment.apiUrl + `/user/${id}`);
  }

  register(user: User) {
    return this.http.post<ApiResponseUser>(environment.apiUrl + '/user/new', user);
  }

  forget(user: User) {
    return this.http.post(environment.apiUrl + '/users/forget', user);
  }

  update(user: User) {
    return this.http.put<ApiResponseUser>(environment.apiUrl + `/user/${user.id}`, user);
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
