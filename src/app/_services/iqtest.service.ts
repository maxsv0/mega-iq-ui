import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiResponseBase, ApiResponseTestResult, ApiResponseTestResultList, IqTest, TestResult} from '@/_models';
import {TestTypeEnum} from '@/_models/enum';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IqTestService {
  constructor(
    private http: HttpClient
  ) {
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

  submitAnswer(id: string, question: number, answer: number) {
    return this.http.post<ApiResponseTestResult>(environment.apiUrl + `/test/${id}`, {question, answer});
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
    iqTestPractice.styleName = 'practice';
    iqTestPractice.name = 'Practice IQ Test';
    iqTestPractice.description = 'Practice IQ Test is designed to familiarize with the methodology of testing';
    iqTestPractice.url = '/iqtest/iq-practice';
    iqTestPractice.pic = 'https://storage.googleapis.com/mega-iq/iqtest/bg-big-practice.jpg';
    iqTestPractice.time = 5;
    iqTestPractice.questions = 5;
    testTypes.push(iqTestPractice);

    const iqTestStandard = new IqTest();
    iqTestStandard.type = TestTypeEnum.STANDART_IQ;
    iqTestStandard.styleName = 'standard';
    iqTestStandard.name = 'Standard IQ Test';
    iqTestStandard.description = 'Standard IQ Test';
    iqTestStandard.url = '/iqtest/iq-standard';
    iqTestStandard.pic = 'https://storage.googleapis.com/mega-iq/iqtest/bg-big-standard.jpg';
    iqTestStandard.time = 10;
    iqTestStandard.questions = 10;
    testTypes.push(iqTestStandard);

    const iqTestMega = new IqTest();
    iqTestMega.type = TestTypeEnum.MEGA_IQ;
    iqTestMega.styleName = 'megaiq';
    iqTestMega.name = 'Mega IQ Test';
    iqTestMega.description = 'This is a serious challenge!';
    iqTestMega.url = '/iqtest/mega-iq';
    iqTestMega.pic = 'https://storage.googleapis.com/mega-iq/iqtest/bg-big-mega.jpg';
    iqTestMega.time = 30;
    iqTestMega.questions = 30;
    testTypes.push(iqTestMega);

    const iqTestMath = new IqTest();
    iqTestMath.type = TestTypeEnum.MATH;
    iqTestMath.styleName = 'math';
    iqTestMath.name = 'Math IQ Test';
    iqTestMath.description = 'Math IQ Test';
    iqTestMath.url = '/iqtest/math';
    iqTestMath.pic = 'https://storage.googleapis.com/mega-iq/iqtest/bg-big-math.jpg';
    iqTestMath.time = 10;
    iqTestMath.questions = 10;
    testTypes.push(iqTestMath);

    const iqTestGrammar = new IqTest();
    iqTestGrammar.type = TestTypeEnum.GRAMMAR;
    iqTestGrammar.styleName = 'grammar';
    iqTestGrammar.name = 'Grammar IQ Test';
    iqTestGrammar.description = 'Grammar IQ Test';
    iqTestGrammar.url = '/iqtest/grammar';
    iqTestGrammar.pic = 'https://storage.googleapis.com/mega-iq/iqtest/bg-big-grammar.jpg';
    iqTestGrammar.time = 10;
    iqTestGrammar.questions = 10;
    testTypes.push(iqTestGrammar);

    return testTypes;
  }
}
