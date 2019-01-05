import {Component, OnDestroy, OnInit} from '@angular/core';
import {Question, TestResult, User} from '@/_models';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';

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
    this.iqTestService.getByCode(testCode)
      .pipe(first())
      .subscribe(
        apiResponseTestResult => {
          if (apiResponseTestResult.ok) {
            this.iqTestService.update(apiResponseTestResult.test);
          } else {
            this.alertService.error(apiResponseTestResult.msg);
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
        });

    this.activeTestSubscription = this.iqTestService.activeTest.subscribe(test => {
      this.activeTest = test;
    });

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.activeQuestionIdSubscription = this.route.params.subscribe(params => {
      if (params['questionId']) {
        this.activeQuestionId = params['questionId'];
      } else {
        this.activeQuestionId = 1;
      }
      if (this.activeTest && this.activeQuestionId) {
        this.activeQuestion = this.activeTest.questionSet[this.activeQuestionId - 1];
      }
      if (params['answerId']) {
        if (this.activeTest.status === TestStatusEnum.ACTIVE) {
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
        },
        error => {
          this.alertService.error('API error: ' + error);
          this.loading = false;
        });
  }

}
