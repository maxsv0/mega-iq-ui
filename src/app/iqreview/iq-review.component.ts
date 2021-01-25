import { Component, OnInit } from '@angular/core';
import {IqTest, Question, TestResult} from '@/_models';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, IqTestService, DialogService} from '@/_services';
import {first} from 'rxjs/operators';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-iq-review',
  templateUrl: './iq-review.component.html',
  styleUrls: ['./iq-review.component.scss']
})
export class IqReviewComponent implements OnInit {

    testTypes: IqTest[] = [];
    testTypesKeys: [] = [];
    loading = false;
    updating = false;
    public testStatus = TestStatusEnum;

    finishedTest: TestResult;
    finishedTestName: string;
    activeQuestionId: number;
    activeQuestionIdPrev: number;
    activeQuestionIdNext: number;
    activeQuestion: Question;

    currentUser: firebase.User;
    currentUserSubscription: Subscription;

    constructor(
      private titleService: Title,
      private iqTestService: IqTestService,
      private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertService,
      private dialogService: DialogService,
      private googleAnalyticsService: GoogleAnalyticsService,
      private i18n: I18n
    ) {
        this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));
        this.activeQuestionId = 1;
        const testCode = this.route.snapshot.params['testCode'];
        if (testCode) { this.initTestByCode(testCode); }

        this.iqTestService.getIqTest().subscribe(tests => {
            this.testTypes = tests;

            Object.entries(this.testTypes).forEach(([key, test]) => {
                this.testTypesKeys[test.type] = key;
            });
        });
    }

    ngOnInit() {
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
                    this.updatefinishedTest(apiResponseTestResult.test);
                } else {
                    this.alertService.error(apiResponseTestResult.msg);
                }
            },
            error => {
                this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
            }
        );
    }

    /**
     * @function setQuestion
     * @param questionId Question Id
     * @description Sets tue current question as active and tracks a 'question open' event
     */
    setQuestion(questionId: number) {
      this.activeQuestionId = questionId;
      this.updatefinishedTest(this.finishedTest);
      this.googleAnalyticsService.sendEvent('classroom', 'question-open', questionId.toString());
    }

    /**
     * @function updatefinishedTest
     * @param test Test model
     * @description Retrieves a current not finished test in order update to it's current state
     */
    private async updatefinishedTest(test: TestResult) {
        this.googleAnalyticsService.sendEvent('classroom', 'open-test', test.type);

        this.updating = true;
        this.finishedTest = test;
        if (this.finishedTest.status !== this.testStatus.FINISHED) { this.createModal(); }

        this.iqTestService.setType(this.finishedTest.type);

        this.setTitle(this.finishedTest.type, this.i18n('Complete'));
        this.activeQuestionIdPrev = this.activeQuestionId - 1;

        if (this.finishedTest && this.activeQuestionId && this.testTypes) {
            this.testTypes.forEach((testData) => {
                if (this.finishedTest.type === testData.type) { this.finishedTestName = testData.name; }
                this.updating = false;
            });
            this.activeQuestion = this.finishedTest.questionSet[this.activeQuestionId - 1];
            this.activeQuestionIdNext = this.activeQuestionId + 1;

            if (this.activeQuestionIdNext > this.finishedTest.questionSet.length) {
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
     * @function createModal
     * @description Shows if user has not completed a test yet, but tries no manually navigate to review.
     */
    private createModal() {
        this.dialogService.create({
            id: 'not-finished',
            title: this.i18n('Test not finished.'),
            body: this.i18n('You have not finished your test yet. You will be redirected to Home.'),
            primary: this.i18n('Back to Home'),
            clickFunctionPrimary: () => {
                this.router.navigate(['/home']);
            },
            close: false
        }).then(modal => modal.open());
    }
}
