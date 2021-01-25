import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService, UserService} from '@/_services';
import {IqTest, TestResult, User} from '@/_models';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {TestTypeEnum} from '@/_models/enum';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsConfig} from 'ngx-sharebuttons';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {isPlatformBrowser} from '@angular/common';
import firebase from 'firebase/app';

/**
 * @class PublicComponent
 * @description User public profile
 */
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
  isLoadingPage = false;
  isLastLoaded = false;
  isPageLoaded: boolean[] = [];
  userTestsPage = 0;
  testTypeEnum = TestTypeEnum;
  isBrowser: boolean;
  customConfig: ShareButtonsConfig;

  currentUser: firebase.User;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private iqTestService: IqTestService,
    private userService: UserService,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private authenticationService: AuthenticationService,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const userId = this.route.snapshot.params['userId'];
    if (userId == null) {
      return;
    }

    this.userId = userId;

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });

    this.isLoadingPage = true;
    this.loadUserResult();
  }

  ngOnInit() {
  }

  /**
   * @function loadUserResult
   * @description Loads tests result list from test result API
   */
  private loadUserResult() {
    if (this.isLastLoaded) {
      return true;
    }

    // this is to prevent multiple API calls for same page
    if (this.isPageLoaded[this.userTestsPage]) {
      return false;
    } else {
      this.isPageLoaded[this.userTestsPage] = true;
    }

    this.userService.getById(this.userId, this.userTestsPage)
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            if (!this.user) {
              this.user = apiResponseTestResultList.user;
              this.setMetaTags(this.user);

              const customShareImage = (this.user.certificate !== null) ? this.user.certificate : this.user.pic;
              this.setCustomShareButtonsConfig(this.titleService, this.titleService.getTitle());
            }

            if (apiResponseTestResultList.tests.length < 8) {
              this.isLastLoaded = true;
            }

            this.userTests = this.userTests.concat(apiResponseTestResultList.tests);

            this.userTestsPage++;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
          }
          this.isLoadingPage = false;
        },
        error => {
          this.alertService.error(error);
          this.isLoadingPage = false;
        });
  }

  /**7
   * @function onScrollDown
   * @description Loads more tests on scroll
   */
  onScrollDown() {
    this.loadUserResult();
  }

  /**
   * @function setMetaTags
   * @description Sets title for user public profile
   * @param user
   */
  public setMetaTags(user: User) {
    if (user.iq != null) {
      this.titleService.setTitle(this.i18n('IQ {{iq}} {{name}} {{location}}', {
        name: user.name,
        iq: user.iq,
        location: user.location
      }));
    } else {
      this.titleService.setTitle(this.i18n('{{name}} {{location}}', {
        name: user.name,
        location: user.location
      }));
    }

    const shareImage = (this.user.certificate !== null) ? this.user.certificate : this.user.pic;

    this.metaService.updateTag({property: 'og:title', content: this.titleService.getTitle()});
    this.metaService.updateTag({property: 'og:description', content: this.titleService.getTitle()});
    this.metaService.updateTag({property: 'og:image', content: shareImage});
    this.metaService.updateTag({property: 'og:url', content: user.url});
  }

  /**
   * @function setCustomShareButtonsConfig
   * @description Sets custom configuration of share buttons
   */
  setCustomShareButtonsConfig(...options: any[]) {
    const [imageOption, titleOption] = options;
    this.customConfig = {
      image: imageOption,
      title: titleOption
    };
    ShareButtonsModule.withConfig(this.customConfig);
  }

}
