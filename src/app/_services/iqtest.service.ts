import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseTestResult} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';


@Injectable({
  providedIn: 'root'
})
export class IqTestService {

  constructor(private http: HttpClient) { }

  startTest(type: TestTypeEnum) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/start', {
      params: {
        type: type
      }
    });
  }
}
