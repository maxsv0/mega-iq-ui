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
      'https://lh3.googleusercontent.com/Lojp8ESI6UAD3qdpGLWWmfqKHs_5q0KeEh8DQiGb777AUo7eyzFM7QckMp6YBcCbF4PACfZjcSmBA5x_Ng',
      'https://lh3.googleusercontent.com/4HtKmr23NdnXrkd6-TiG9abdvBNwPWDi_LqFPZxU0dGk11pREXwqFbxcp4jPj8c1hXnrzHDBo4wa5J8CgQ',
      'https://lh3.googleusercontent.com/dqdJbHRzhIjO7rfvkuAFQ6ibpIDPEL-UbwGYbPW8H67jgx5v9s75uQeP4WlmzCqroY9J_HVRzGRoq2AylQ',
      'https://lh3.googleusercontent.com/Bp8dpHqZqNrUe8LQRKhrObIX8j3W1R8AV1PHKa7PSKI7XdJSE0-DXIVOAiEl2BV8owDYaiFWaWudtH54ww',
      'https://lh3.googleusercontent.com/mxHWe8tBOzoQTGvhvF9ELfPlf83CT3GBTnrZIv7YdDVPo8eO_-WgOBeTJcqyu5U2ZYxr6rXHWXNQjr2uHw',
      'https://lh3.googleusercontent.com/Iu44EM45N70R_VH7thrVXjSJVx43TkBqXgwxddW-osgIPcdxSVD37_PJDxUyuRU0pEcKOE87wGq6gX7pCWA',
      'https://lh3.googleusercontent.com/vla8T5PM5qPWdx2rEN3_jC2scRjZchsxlom4UfaexEyVOPsnXoierjSJATRoT8riEUISlUNv3v4sJgUaXg',
      'https://lh3.googleusercontent.com/Isx_5K6x_cZd9BvoZQHoLo9j7PViWJWizgo9UjBDqR8UnMXpA342yNH9U5_lYjDNsjUqMbhyVAw2MmeF1g',
      'https://lh3.googleusercontent.com/oiGwqiCR3_p0d2sOZjeXtW5J01nmb4ehImsFLQ1Y9K6_zjnjD6-Fvw515DZaXPynb9QK162yHI9DDDY2ANs',
      'https://lh3.googleusercontent.com/9Yzp9LIGeSTkuamCLGAn6P1O44F4bsFN6DKlFpKAF1WKLFbnbByV5pJp0NGtVnglASv91BHR3Yx523iuIQ'
    );
  }
}
