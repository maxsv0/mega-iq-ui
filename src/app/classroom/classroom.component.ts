import {Component, OnInit} from '@angular/core';
import {IqTest, Question, TestResult, User} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService, DialogService} from '@/_services';
import {FormBuilder} from '@angular/forms';
import {first} from 'rxjs/operators';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import firebase from 'firebase/app';

/**
 * @class ClassroomComponent
 * @implements OnInit,
 * @description Controller for the individual test component called 'Classroom'
 */
@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {

  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];
  loading = false;
  updating = false;
  public testStatus = TestStatusEnum;
  remainingTime: number;

  activeTest: TestResult;
  activeTestName: string;
  activeQuestionId: number;
  activeQuestionIdPrev: number;
  activeQuestionIdNext: number;
  activeTestCompleted = false;
  activeQuestion: Question;

  currentUser: firebase.User;
  currentUserSubscription: Subscription;
  currentUserisAnonymous = false;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));
    this.currentUserisAnonymous = this.authenticationService.currentUserValue.isAnonymous;

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
  }

  ngOnInit() {
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
              if(this.currentUserisAnonymous) {
                this.anonUserModal(apiResponseTestResult.test.code);
              } else {
                  this.router.navigate(['/iqtest/result/' + apiResponseTestResult.test.code]);
                  this.googleAnalyticsService.sendEvent('iq-test', 'finish-test', this.activeTest.type);
              }
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error.message);
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
    const allQuestionsAnswered = this.activeTest.questionSet.every(q => q.answerUser !== null);
    if(this.activeTest.status !== this.testStatus.ACTIVE) this.createModal(this.activeTest.status, this.activeTest.code);

    if(this.activeTest && allQuestionsAnswered) {
        this.activeTestCompleted = true;
        this.alertService.success(this.i18n('The test is finished. Please press the submit button to submit your result.'));
        this.setTitle(this.activeTest.type, this.i18n('Complete'));
    } else {
        this.setTitle(this.activeTest.type, `${this.activeQuestionId} ${this.i18n('question')} ${this.i18n('of')} ${this.activeTest.questionSet.length}`);
    }
    this.activeQuestionIdPrev = this.findUnansweredQuestion(this.activeTest.questionSet, 'prev');

    if (this.activeTest && this.activeQuestionId && this.testTypes) {
      this.testTypes.forEach(
        (testData) => {
          if (this.activeTest.type === testData.type) {
            this.activeTest.status !== this.testStatus.ACTIVE ? this.dialogService.open() : this.expireCountdown(this.activeTest.createDate, testData.expire);
            this.activeTestName = testData.name;
          }
          this.updating = false;
        }
      );
      this.activeQuestion = this.activeTest.questionSet[this.activeQuestionId - 1];
        this.activeQuestionIdNext = this.findUnansweredQuestion(this.activeTest.questionSet, 'next');
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
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
        });
  }

  /**
   * @function setTitle
   * @param type Test enum
   * @param progress Test progress
   * @description Sets title of current test
   */
  public setTitle(type: TestTypeEnum, progress: string) {
    const testName = this.testTypes[this.testTypesKeys[type]].name;

    this.titleService.setTitle(this.i18n('{{progress}} {{test}}', {
      progress: progress,
      test: testName
    }));
  }

  /**
   * @function findUnansweredQuestion
   * @param questions Current test question set
   * @param goTo Navigation direction
   * @description Find index of previous or next unanswered question
   */
    private findUnansweredQuestion(questions: Question[], goTo: string) {
        const activeQuestionIndex = this.activeQuestionId - 1;
        const prevUnansweredQuestion = (questions.findIndex((q, i) => q.answerUser === null && i < activeQuestionIndex) + 1);
        const nextUnansweredQuestion = (questions.findIndex((q, i) => q.answerUser === null && i > activeQuestionIndex) + 1);
        const cycleBack = (questions.findIndex(q => q.answerUser === null) + 1);
        if(prevUnansweredQuestion !== 0 && goTo === 'prev') {
            return prevUnansweredQuestion;
        } else if(nextUnansweredQuestion !== 0 && goTo === 'next') {
            return nextUnansweredQuestion;
        } else {
            return cycleBack;
        }
    }

    /**
     * @function expireCountdown
     * @param createDate Date when test was created
     * @param expireTime Expire value (in minutes)
     * @description Counts down the time of expiry of the test from the time it was created
     */
    private expireCountdown(createDate: Date, expireTime: number): void {
        const minInMs = 60000;
        const secInMs = 1000;
        const timeOffset = 7 * secInMs;
        const start = new Date(createDate).getTime();
        const expire = Math.floor(expireTime * minInMs);
        const countDownDate = start + expire + timeOffset;

        const x = setInterval(() => {
            const now = new Date().getTime();
            this.remainingTime = countDownDate - now;
            if(this.remainingTime < 0) {
                clearInterval(x);
                this.remainingTime = 0;
                this.dialogService.open();
            }
        }, secInMs);
    }

    /**
     * @function createModal
     * @param status Test status
     * @param code Test code
     * @description Creates test modal
     */
    private createModal(status: TestStatusEnum, code: string) {
        this.dialogService.create({
            id: status.toLocaleLowerCase(),
            title: this.i18n(`Test ${status.toLocaleLowerCase()}.`),
            body: status === this.testStatus.EXPIRED ? this.i18n('Your test has expired. You will be redirected to Home. Please start a new test.') : this.i18n('You have completed this test. Check the result of this test.'),
            primary: status === this.testStatus.EXPIRED ? this.i18n('Back to Home') : this.i18n('Check results'),
            clickFunctionPrimary: () => {
                status === this.testStatus.EXPIRED ? this.router.navigate(['/home']) : this.router.navigate(['/iqtest/result/' + code]);
            },
            close: false
        });
    }

    private anonUserModal(code: TestResult["code"]): void {
        const modalBody = `
            <p>${this.i18n("You are logged in as an anonymous user.")}</p>
            <p>${this.i18n("Click below to create an account or continue anonymously.")}</p>
        `;
        this.dialogService.create({
            id: "anon-user-register",
            title: this.i18n("Register anonymous account."),
            body: modalBody,
            primary: this.i18n("Register account"),
            secondary: this.i18n("Continue anonyomously"),
            clickFunctionPrimary: () => {
                this.router.navigate(['/register/anonymous'])
            },
            clickFunctionSecondary: () => {
                this.router.navigate(['/iqtest/result/' + code]);
            },
            close: false
        }).then(modal => modal.open());
    }
}
