import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseBase, ApiResponseTestResult, ApiResponseTestResultList, ApiResponseTests, IqTest} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {BehaviorSubject, Observable} from 'rxjs';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  private testTypes = [];
  public testTypesSubscription: Observable<IqTest[]>;
  private testTypesSubject: BehaviorSubject<IqTest[]>;

  constructor(
    private http: HttpClient
  ) {
    this.testTypesSubject = new BehaviorSubject<IqTest[]>(this.testTypes);
    this.testTypesSubscription = this.testTypesSubject.asObservable();

    this.http.get<ApiResponseTests>(environment.apiUrl + '/test')
      .pipe(first())
      .subscribe(
        apiResponseTests => {
          if (apiResponseTests.ok) {
            this.testTypes = apiResponseTests.tests;
            this.testTypesSubject.next(this.testTypes);
          }
        });
  }

  deleteTestResult(code: string) {
    return this.http.delete<ApiResponseBase>(environment.apiUrl + `/test/${code}`);
  }

  startTest(type: TestTypeEnum) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/start', {
      params: {
        type: type
      }
    });
  }

  finishTest(code: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/finish', {
      params: {
        testCode: code
      }
    });
  }

  submitAnswer(id: string, question: number, answer: number) {
    return this.http.post<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`, {question, answer});
  }

  getByCode(id: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`);
  }

  getMyAll(page: number) {
    console.log("page ", page );
    return this.http.get<ApiResponseTestResultList>(environment.apiUrl + `/list-my?page=${page}`);
  }

  getIqTest() {
    return this.testTypesSubscription;
  }
}
