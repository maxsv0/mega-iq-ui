import {Inject, Injectable, Optional} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseBase, ApiResponseTestResult, ApiResponseTestResultList, ApiResponseTests, IqTest} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {ApiResponsePublicTestResultList} from '@/_models/api-response-public-test-result-list';
import {first} from 'rxjs/operators';
import {TransferState} from '@angular/platform-browser';
import {DATA_TEST_RESULT, DATA_TESTS, STATE_KEY_TEST_RESULT, STATE_KEY_TESTS} from '@/_helpers/tokens';

/**
 * @class IqTestService
 * @description Different actions to do with IQ tests like starting, deleting etc...
 */
@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  private apiTests: ApiResponseTests;
  private apiTestResult: ApiResponsePublicTestResultList;

  private testTypes = [];
  public testTypesSubscription: Observable<IqTest[]>;
  private testTypesSubject: BehaviorSubject<IqTest[]>;
  private activeTestType = new Subject<TestTypeEnum>();

  constructor(
    private http: HttpClient,
    private state: TransferState,
    @Optional() @Inject(DATA_TESTS) private dataApiTests: ApiResponseTests,
    @Optional() @Inject(DATA_TEST_RESULT) private dataApiTestResult: ApiResponsePublicTestResultList
  ) {
    // Get variable from TransferState service if it exists.
    // This part is for browser-side
    this.apiTests = this.state.get(STATE_KEY_TESTS, null);
    this.apiTestResult = this.state.get(STATE_KEY_TEST_RESULT, null);

    // Look for injected value and if found send it to TransferState
    // This part is only for server-side
    if (dataApiTests) {
      this.apiTests = dataApiTests;
      this.state.set(STATE_KEY_TESTS, this.apiTests);
    }
    if (dataApiTestResult) {
      this.apiTestResult = dataApiTestResult;
      this.state.set(STATE_KEY_TEST_RESULT, this.apiTestResult);
    }

    // Convert cached response to values
    if (this.apiTests && this.apiTests.ok) {
      this.testTypes = this.apiTests.tests;
    }

    this.testTypesSubject = new BehaviorSubject<IqTest[]>(this.testTypes);
    this.testTypesSubscription = this.testTypesSubject.asObservable();

    if (!this.testTypes || this.testTypes.length === 0) {
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
  }

  getLatestResults() {
    if (this.apiTestResult) {
      return of(this.apiTestResult);
    } else {
      return this.http.get<ApiResponsePublicTestResultList>(environment.apiUrl + `/list-latest`);
    }
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
    return this.activeTestType;
  }

  updateTestType(tests: IqTest[]) {
    this.testTypesSubject.next(tests);
  }

}
