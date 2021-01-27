import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseBase, ApiResponseTestResult, ApiResponseTestResultList} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {Observable} from 'rxjs';
import {ApiResponsePublicTestResultList} from '@/_models/api-response-public-test-result-list';
import {ServerDataModule} from '@/server-data.module';

/**
 * @class IqTestService
 * @description Different actions to do with IQ tests like starting, deleting etc...
 */
@Injectable({
  providedIn: 'root'
})
export class IqTestService {

  constructor(
    private http: HttpClient,
    private serverDataModule: ServerDataModule
  ) {
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
    return this.serverDataModule.testTypesSubscription;
  }

  getType(): Observable<TestTypeEnum> {
    return this.serverDataModule.getType();
  }
}
