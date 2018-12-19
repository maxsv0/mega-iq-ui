import {Component, OnDestroy, OnInit} from '@angular/core';
import {TestResult, User} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService} from '@/_services';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {
  questionForm: FormGroup;

  activeTest: TestResult;
  activeTestSubscription: Subscription;

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

  }

  ngOnDestroy() {
    this.activeTestSubscription.unsubscribe();
  }

  private createForm() {
    this.questionForm = this.formBuilder.group({
      id: [this.activeTest.code]
      // answer1: [this.activeTest.questionSet.pop()],
      // answer2: [this.activeTest.questionSet.pop()],
      // answer3: [this.activeTest.questionSet.pop()],
      // answer4: [this.activeTest.questionSet.pop()],
      // answer5: [this.activeTest.questionSet.pop()],
      // answer6: [this.activeTest.questionSet.pop()],
    });
  }

}
