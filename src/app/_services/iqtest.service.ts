import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseBase, ApiResponseTestResult, ApiResponseTestResultList, ApiResponseTests, IqTest} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';
import {ApiResponsePublicTestResultList} from '@/_models/api-response-public-test-result-list';

/**
 * @class IqTestService
 * @description Different actions to do with IQ tests like starting, deleting etc...
 */
@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  private testTypes = [];
  public testTypesSubscription: Observable<IqTest[]>;
  private testTypesSubject: BehaviorSubject<IqTest[]>;
  private activeTestType = new Subject<TestTypeEnum>();

  constructor(
    private http: HttpClient
  ) {
    console.log('IqTestService started!!');

    this.testTypesSubject = new BehaviorSubject<IqTest[]>(this.testTypes);
    this.testTypesSubscription = this.testTypesSubject.asObservable();

    const testsData = localStorage.getItem('IqTestService/test');
    if (testsData) {
      this.testTypes = JSON.parse(testsData);
      this.testTypesSubject.next(this.testTypes);
    } else {
      this.http.get<ApiResponseTests>(environment.apiUrl + '/test')
        .pipe(first())
        .subscribe(
          apiResponseTests => {
            if (apiResponseTests.ok) {
              this.testTypes = apiResponseTests.tests;
              this.testTypesSubject.next(this.testTypes);

              localStorage.setItem('IqTestService/test', JSON.stringify(apiResponseTests.tests));
            }
          });
    }
  }

  getLatestResults() {
    return this.http.get<ApiResponsePublicTestResultList>(environment.apiUrl + `/list-latest`);
  }

  /**
   * @function deleteTestResult
   * @param code Test code
   */
  deleteTestResult(code: string) {
    return this.http.delete<ApiResponseBase>(environment.apiUrl + `/test/${code}`);
  }

  /**
   * @function startTest
   * @param type Test type
   */
  startTest(type: TestTypeEnum) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/start', {
      params: {
        type: type
      }
    });
  }

  /**
   * @function finishTest
   * @param code Test code
   */
  finishTest(code: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/finish', {
      params: {
        testCode: code
      }
    });
  }

  /**
   * @function submitAnswer
   * @param id Question id
   * @param question Question number
   * @param answer Answer number
   * @description Submits answer in classroom
   */
  submitAnswer(id: string, question: number, answer: number) {
    return this.http.post<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`, {question, answer});
  }

  /**
   * @function getByCode
   * @param id Test code
   * @description Gets a test by test code
   */
  getByCode(id: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`);
  }

  /**
   * @function getClassroomTestByCode
   * @param id Test code
   * @description Gets a not finished test by classroom test code
   */
  getClassroomTestByCode(id: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + `/classroom/${id}`);
  }

  /**
   * @function getMyAll
   * @param page Pagination for showing all tests
   * @description Gets all tests for user home
   */
  getMyAll(page: number) {
    return this.http.get<ApiResponseTestResultList>(environment.apiUrl + `/list-my?page=${page}`);
  }

  /**
   * @function getIqTest
   * @description Gets a single test
   */
  getIqTest() {
    return this.testTypesSubscription;
  }

  getType(): Observable<TestTypeEnum> {
    return this.activeTestType.asObservable();
  }

  setType(type: TestTypeEnum) {
    this.activeTestType.next(type);
  }
}
