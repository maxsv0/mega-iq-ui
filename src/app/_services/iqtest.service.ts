import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseTestResult, ApiResponseTestResultList, IqTest, TestResult} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  private activeTestSubject: BehaviorSubject<TestResult>;
  public activeTest: Observable<TestResult>;

  constructor(
    private http: HttpClient
  ) {
    this.activeTestSubject = new BehaviorSubject<TestResult>(JSON.parse(localStorage.getItem('currentTest')));
    this.activeTest = this.activeTestSubject.asObservable();
  }

  public get activeTestValue(): TestResult {
    return this.activeTestSubject.value;
  }

  update(test: TestResult) {
    localStorage.setItem('currentTest', JSON.stringify(test));
    this.activeTestSubject.next(test);
  }

  startTest(type: TestTypeEnum) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + '/test/start', {
      params: {
        type: type
      }
    });
  }

  submitAnswer(id: string, question: number, answer: number) {
    return this.http.post<ApiResponseTestResult>(environment.apiUrl + '/test/' + id, {
      params: {
        question: question,
        answer: answer
      }
    });
  }

  getByCode(id: string) {
    return this.http.get<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`);
  }

  getMyAll() {
    return this.http.get<ApiResponseTestResultList>(environment.apiUrl + '/list-my');
  }

  getIqTest() {
    const testTypes = [];

    const iqTestPractice = new IqTest();
    iqTestPractice.type = TestTypeEnum.PRACTICE_IQ;
    iqTestPractice.name = 'Practice IQ Test';
    iqTestPractice.url = '/iqtest/iq-practice';
    iqTestPractice.pic = '/sssss.';
    testTypes.push(iqTestPractice);

    const iqTestStandart = new IqTest();
    iqTestStandart.type = TestTypeEnum.STANDART_IQ;
    iqTestStandart.name = 'Standart IQ Test';
    iqTestStandart.url = '/iqtest/iq-standard';
    iqTestStandart.pic = '/sssss.';
    testTypes.push(iqTestStandart);

    const iqTestMega = new IqTest();
    iqTestMega.type = TestTypeEnum.MEGA_IQ;
    iqTestMega.name = 'Mega IQ Test';
    iqTestMega.url = '/iqtest/mega-iq';
    iqTestMega.pic = '/sssss.';
    testTypes.push(iqTestMega);

    const iqTestMath = new IqTest();
    iqTestMath.type = TestTypeEnum.MATH;
    iqTestMath.name = 'Math IQ Test';
    iqTestMath.url = '/iqtest/math';
    iqTestMath.pic = '/sssss.';
    testTypes.push(iqTestMath);

    const iqTestGrammar = new IqTest();
    iqTestGrammar.type = TestTypeEnum.GRAMMAR;
    iqTestGrammar.name = 'Grammar IQ Test';
    iqTestGrammar.url = '/iqtest/grammar';
    iqTestGrammar.pic = '/sssss.';
    testTypes.push(iqTestGrammar);

    return testTypes;
  }
}
