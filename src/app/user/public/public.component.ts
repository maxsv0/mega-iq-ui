import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, IqTestService, UserService} from '@/_services';
import {IqTest, TestResult, User} from '@/_models';
import {first} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {TestTypeEnum} from '@/_models/enum';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  userId: number;
  user: User;
  userTests: TestResult[] = [];
  testTypes: IqTest[];
  testTypesKeys: [] = [];
  isLoading = false;
  isLastLoaded = false;
  userTestsPage = 0;
  testTypeEnum = TestTypeEnum;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private iqTestService: IqTestService,
    private userService: UserService,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));
  }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
    if (userId == null) {
      return;
    }

    this.userId = userId;

    this.loadUserResult();

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });
  }

  private loadUserResult() {
    if (this.isLastLoaded) {
      return true;
    }

    this.isLoading = true;

    this.userService.getById(this.userId, this.userTestsPage)
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            if (!this.user) {
              this.user = apiResponseTestResultList.user;
              this.setTitle(this.user.name, this.user.iq, this.user.location);
            }

            if (apiResponseTestResultList.tests.length < 8) {
              this.isLastLoaded = true;
            }

            this.userTests = this.userTests.concat(apiResponseTestResultList.tests);

            console.log('Load page ' + this.userTestsPage + '  load done!');
            this.userTestsPage++;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }
          this.isLoading = false;
        },
        error => {
          this.alertService.error(error);
          this.isLoading = false;
        });
  }

  onScrollDown() {
    console.log('Load page ' + this.userTestsPage + '  scrolled down!!');

    this.loadUserResult();
  }

  public setTitle(name: string, iq: number, location: string) {
    if (iq != null) {
      this.titleService.setTitle(this.i18n('IQ {{iq}} {{name}} {{location}}', {
        name: name,
        iq: iq,
        location: location
      }));
    } else {
      this.titleService.setTitle(this.i18n('{{name}} {{location}}', {
        name: name,
        location: location
      }));
    }
  }

}
