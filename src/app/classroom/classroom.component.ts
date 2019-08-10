import {Component, OnDestroy, OnInit} from '@angular/core';
import {IqTest, Question, TestResult, User} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {FormBuilder} from '@angular/forms';
import {first} from 'rxjs/operators';
import {TestStatusEnum} from '@/_models/enum';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  loading = false;
  updating: boolean = false;
  public testStatus = TestStatusEnum;

  activeTest: TestResult;
  activeTestName: string;
  activeQuestionId: number;
  activeQuestionIdPrev: number;
  activeQuestionIdNext: number;
  activeQuestion: Question;

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private iqTestService: IqTestService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    this.activeQuestionId = 1;
    const testCode = this.route.snapshot.params['testCode'];
    if (testCode) {
      this.initTestByCode(testCode);
    }

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;
    });

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  setQuestion(questionId: number) {
    this.activeQuestionId = questionId;
    this.updateActiveTest(this.activeTest);
  }

  submitAllRandom(code: string) {
    let index = 1;
    this.activeTest.questionSet.forEach(
      (question) => {
        this.submitAnswer(code, index++, question.answers[0].id);
      }
    );
  }

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
          this.alertService.error('API Service Unavailable. ' + error);
          this.loading = false;
        });
  }

  submitFinish(code: string) {
    this.loading = true;
    this.iqTestService.finishTest(code)
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
          this.alertService.error('API Service Unavailable. ' + error);
          this.loading = false;
        });
  }

  private async updateActiveTest(test: TestResult) {
    this.updating = true;
    this.activeTest = test;
    this.activeQuestionIdPrev = this.activeQuestionId - 1;

    try {
      if (this.activeTest && this.activeQuestionId) {
        await this.testTypes.forEach(
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
    } catch (err) {
      this.alertService.error(`API Service Unavailable. ${err}`);
    }

  }

  private initTestByCode(testCode: string) {
    this.iqTestService.getByCode(testCode)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.activeTest = apiResponseTestResult.test;
            this.updateActiveTest(apiResponseTestResult.test);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
        },
        error => {
          this.alertService.error('API Service Unavailable. ' + error);
        });
  }

}
