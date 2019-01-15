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

    this.testTypes = this.iqTestService.getIqTest();

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
          this.alertService.error('API error: ' + error);
          this.loading = false;
        });
  }

  private updateActiveTest(test: TestResult) {
    this.activeTest = test;
    this.activeQuestionIdPrev = this.activeQuestionId - 1;

    if (this.activeTest && this.activeQuestionId) {
      this.testTypes.forEach(
        (testData) => {
          if (this.activeTest.type === testData.type) {
            this.activeTestName = testData.name;
          }
        }
      );
      this.activeQuestion = this.activeTest.questionSet[this.activeQuestionId - 1];
      this.activeQuestionIdNext = this.activeQuestionId + 1;
      if (this.activeQuestionIdNext > this.activeTest.questionSet.length) {
        this.activeQuestionIdNext = 0;
      }
    } else {
      this.activeQuestionIdNext = 0;
      this.activeQuestion = null;
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
          this.alertService.error('API error: ' + error);
        });
  }

}
