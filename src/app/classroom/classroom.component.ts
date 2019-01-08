import {Component, OnDestroy, OnInit} from '@angular/core';
import {Question, TestResult, User} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {FormBuilder} from '@angular/forms';
import {first} from 'rxjs/operators';
import {TestStatusEnum} from '@/_models/enum';
import * as $ from 'jquery';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {
  loading = false;
  public testStatus = TestStatusEnum;

  activeTest: TestResult;
  activeTestSubscription: Subscription;
  activeQuestionIdSubscription: Subscription;
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
    const testCode = this.route.snapshot.params['testCode'];
    if (testCode) {
      this.loadTestByCode(testCode);
    }

    this.activeTestSubscription = this.iqTestService.activeTest.subscribe(test => {
      this.activeTest = test;
    });

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.activeQuestionIdSubscription = this.route.params.subscribe(params => {
      if (params['testCode']) {
        this.loadTestByCode(params['testCode']);
      }

      if (params['questionId']) {
        this.activeQuestionId = Number(params['questionId']);
      } else {
        this.activeQuestionId = 1;
      }

      this.updateActiveTest();

      if (params['answerId']) {
        const answerId = Number(params['answerId']);
        if (answerId && this.activeQuestion.answers[answerId] && this.activeQuestion.answerUser !== answerId
          && this.activeTest.status === TestStatusEnum.ACTIVE) {
          this.submitAnswer(this.activeTest.code, this.activeQuestionId, params['answerId']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.activeTestSubscription.unsubscribe();
  }

  submitAnswer(code: string, question: number, answer: number) {
    this.loading = true;
    this.iqTestService.submitAnswer(code, question, answer)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.iqTestService.update(apiResponseTestResult.test);
            this.activeQuestion = this.activeTest.questionSet[this.activeQuestionId - 1];
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
          this.loading = false;
          $('#loadingDone').removeClass('d-none').show().fadeOut('slow');
        },
        error => {
          this.alertService.error('API error: ' + error);
          this.loading = false;
        });
  }

  private updateActiveTest() {
    this.activeQuestionIdPrev = this.activeQuestionId - 1;

    if (this.activeTest && this.activeQuestionId) {
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

  private loadTestByCode(testCode: string) {
    this.iqTestService.getByCode(testCode)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.iqTestService.update(apiResponseTestResult.test);
            this.updateActiveTest();
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
        });
  }

}
