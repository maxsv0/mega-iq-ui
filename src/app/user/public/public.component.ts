import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, IqTestService, UserService} from '@/_services';
import {ApiResponseTestResultList, IqTest, TestResult, User} from '@/_models';
import {first} from 'rxjs/operators';
import {Meta, Title, TransferState} from '@angular/platform-browser';
import {TestTypeEnum} from '@/_models/enum';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsConfig} from 'ngx-sharebuttons';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import firebase from 'firebase/app';
import {APP_LOCALE_ID} from '../../../environments/app-locale';
import {STATE_KEY_USER_PUBLIC} from '@/_helpers/tokens';

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
  private userPublic: ApiResponseTestResultList;

  userId: number;
  user: User;
  userTests: TestResult[] = [];
  testTypes: IqTest[];
  testTypesKeys: [] = [];
  isLoadingPage = false;
  isLastLoaded = false;
  userNotFound = false;
  isPageLoaded: boolean[] = [];
  userTestsPage = 0;
  testTypeEnum = TestTypeEnum;
  isBrowser: boolean;
  customConfig: ShareButtonsConfig;
  hostName: string;

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
    private state: TransferState,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    const userId = this.route.snapshot.params['userId'];
    if (userId == null) {
      return;
    }

    let hostName = 'https://www.mega-iq.com';
    // @ts-ignore
    if (APP_LOCALE_ID === 'de') {
      hostName = 'https://de.mega-iq.com';
      // @ts-ignore
    } else if (APP_LOCALE_ID === 'es') {
      hostName = 'https://es.mega-iq.com';
      // @ts-ignore
    } else if (APP_LOCALE_ID === 'ru') {
      hostName = 'https://ru.mega-iq.com';
    }
    this.hostName = hostName;

    this.userId = Number(userId);

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

    // this is browser instance and it should check for data from transfer state service
    this.userPublic = this.state.get(STATE_KEY_USER_PUBLIC, null);

    if (this.userPublic && this.userPublic.ok && this.userPublic.user && this.userPublic.user.id === this.userId) {
      this.processApiResponse(this.userPublic);
    } else {
      this.loadUserResult();
      this.isLoadingPage = true;
    }
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
            this.userPublic = apiResponseTestResultList;

            if (!this.isBrowser && this.userTestsPage === 0) {
              this.state.set(STATE_KEY_USER_PUBLIC, this.userPublic);
            }

            this.processApiResponse(this.userPublic);

            this.userTestsPage++;
          } else {
            this.alertService.error(apiResponseTestResultList.msg);
            this.userNotFound = true;

            this.titleService.setTitle(this.i18n('Error 404. User not found.'));
          }
          this.isLoadingPage = false;
        },
        error => {
          this.alertService.error(error);
          this.isLoadingPage = false;
          this.userNotFound = true;
        });
  }

  processApiResponse(userPublic: ApiResponseTestResultList) {
    if (userPublic.user && userPublic.user.locale !== APP_LOCALE_ID.toUpperCase() && userPublic.user.homepage) {
      this.document.location.href = userPublic.user.homepage;
    }

    if (userPublic.user) {
      this.user = userPublic.user;

      this.setMetaTags(this.user);

      const customShareImage = (this.user.certificate !== null) ? this.user.certificate : this.user.pic;
      this.setCustomShareButtonsConfig(customShareImage, this.titleService.getTitle());
    }

    if (userPublic.tests) {
      this.userTests = this.userTests.concat(userPublic.tests);

      if (userPublic.tests.length < 8) {
        this.isLastLoaded = true;
      }
    }
  }

  /**
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
      this.titleService.setTitle(this.i18n('user:meta:title:IQ {{iq}} {{name}} {{location}}', {
        name: user.name,
        iq: user.iq,
        location: user.location
      }));
    } else {
      this.titleService.setTitle(this.i18n('user:meta:title:{{name}} {{location}}', {
        name: user.name,
        location: user.location
      }));
    }

    const description = this.i18n('user:meta:description:{{name}} {{location}}', {
      name: user.name,
      location: user.location
    });
    const shareImage = (this.user.certificate !== null) ? this.user.certificate : this.user.pic;

    this.metaService.updateTag({property: 'og:title', content: this.titleService.getTitle()});
    this.metaService.updateTag({property: 'og:description', content: description});
    this.metaService.updateTag({name: 'description', content: description});
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
      title: titleOption,
      url: this.hostName + '/user/' + this.userId
    };
    ShareButtonsModule.withConfig(this.customConfig);
  }

}
