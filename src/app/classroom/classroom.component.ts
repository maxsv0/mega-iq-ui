import {Component, OnDestroy, OnInit} from '@angular/core';
import {IqTest, Question, TestResult, User} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {FormBuilder} from '@angular/forms';
import {first} from 'rxjs/operators';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';

/**
 * @class ClassroomComponent
 * @implements OnInit, OnDestroy
 * @description Controller for the individual test component called 'Classroom'
 */
@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  loading = false;
  updating = false;
  public testStatus = TestStatusEnum;

  activeTest: TestResult;
  activeTestName: string;
  activeQuestionId: number;
  activeQuestionIdPrev: number;
  activeQuestionIdNext: number;
  activeQuestionAllDone = false;
  activeQuestion: Question;

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));

    this.activeQuestionId = 1;
    const testCode = this.route.snapshot.params['testCode'];
    if (testCode) {
      this.initTestByCode(testCode);
    }

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  /**
   * @function ngOnDestroy
   * @description Unsubscribes from user event when component is detached
   */
  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  /**
   * @function setQuestion
   * @param questionId Question Id
   * @description Sets tue current question as active and tracks a 'question open' event
   */
  setQuestion(questionId: number) {
    this.activeQuestionId = questionId;
    this.updateActiveTest(this.activeTest);

    this.googleAnalyticsService.sendEvent('classroom', 'question-open', questionId.toString());
  }

  /**
   * @function submitAnswer
   * @param code Question code
   * @param question The test question
   * @param answer The test answer
   * @description Submits answer and sends request to test result API
   */
  submitAnswer(code: string, question: number, answer: number) {
    this.loading = true;
    this.iqTestService.submitAnswer(code, question, answer)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.updateActiveTest(apiResponseTestResult.test);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });

    this.googleAnalyticsService.sendEvent('classroom', 'question-submit', question.toString(), answer);
  }

  /**
   * @function submitFinish
   * @param code Test code
   * @description Sumbits test and send request to Test result API, navigates to result page of test
   */
  submitFinish(code: string) {
    this.loading = true;
    this.iqTestService.finishTest(code)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.router.navigate(['/iqtest/result/' + apiResponseTestResult.test.code]);

            this.googleAnalyticsService.sendEvent('iq-test', 'finish-test', this.activeTest.type);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }

  /**
   * @function updateActiveTest
   * @param test Test model
   * @description Retrieves a current not finished test in order update to it's current state
   */
  private async updateActiveTest(test: TestResult) {
    this.googleAnalyticsService.sendEvent('classroom', 'open-test', test.type);

    this.updating = true;
    this.activeTest = test;
    this.activeQuestionIdPrev = this.activeQuestionId - 1;

    if (this.activeTest) {
      this.activeQuestionAllDone = true;
      this.activeTest.questionSet.forEach(question => {
        if (question.answerUser === null) {
          this.activeQuestionAllDone = false;
        }
      });
    }

    if (this.activeTest && this.activeQuestionId && this.testTypes) {
      this.testTypes.forEach(
        (testData) => {
          if (this.activeTest.type === testData.type) {
            this.activeTestName = testData.name;
          }
          this.updating = false;
        }
      );
      this.activeQuestion = this.activeTest.questionSet[this.activeQuestionId - 1];
      this.activeQuestionIdNext = this.activeQuestionId + 1;
      if (this.activeQuestionIdNext > this.activeTest.questionSet.length) {
        this.activeQuestionIdNext = 0;
        this.updating = false;
      }
    } else {
      this.activeQuestionIdNext = 0;
      this.activeQuestion = null;
      this.updating = false;
    }
  }

  /**
   * @function initTestByCode
   * @param testCode Test code
   * @description Initiates a new test by it's code
   */
  private initTestByCode(testCode: string) {
    this.iqTestService.getClassroomTestByCode(testCode)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.updateActiveTest(apiResponseTestResult.test);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }

          this.setTitle(
            this.activeTest.type,
            this.activeTest.toString()
            );

          this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
        });
  }

  /**
   * @function setTitle
   * @param type Test enum
   * @param date Test date
   * @description Sets title of current test
   */
  public setTitle(type: TestTypeEnum, date: string) {
    const testName = this.testTypes[this.testTypesKeys[type]].name;

    this.titleService.setTitle(this.i18n('{{test}} {{date}}', {
      test: testName,
      date: date
    }));
  }
}
