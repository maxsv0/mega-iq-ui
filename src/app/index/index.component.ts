import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AlertService, IqTestService, UserService} from '@/_services';
import {IqTest, User} from '@/_models';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Meta, Title} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';
import {ShareButtonsConfig} from 'ngx-sharebuttons';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';

/**
 * @class IndexComponent
 * @description Home page controller
 */
@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  testTypes: IqTest[] = [];
  usersList: User[] = [];
  usersTop: User[] = [];
  userExamples: User[];
  isBrowser: boolean;
  customConfig: ShareButtonsConfig;

  /** Owl carousel config **/
  carouselOptions = {
    margin: 25,
    nav: true,
    navText: ['<div class=\'nav-btn prev-slide\'></div>', '<div class=\'nav-btn next-slide\'></div>'],
    responsiveClass: true,
    responsive: {
      320: {
        items: 1,
        nav: true
      },
      425: {
        items: 1,
        nav: true
      },
      768: {
        items: 2,
        nav: true,
        loop: false
      },
      1024: {
        items: 3,
        nav: true,
        loop: false
      }
    }
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private iqTestService: IqTestService,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;
    });

    this.isBrowser = isPlatformBrowser(this.platformId);
    this.titleService.setTitle(this.i18n('Mega-IQ free online IQ test'));
    const metaImage = 'https://img.mega-iq.com/g/about/img/bg-index.jpg';
    const metaTitle = this.titleService.getTitle();
    const metaDescription = this.i18n('Join the Mega IQ now! IQ Tests Passed');
    this.metaService.updateTag({property: 'og:title', content: metaTitle});
    this.metaService.updateTag({property: 'og:description', content: metaDescription});
    this.metaService.updateTag({property: 'og:image', content: metaImage});
    this.setCustomShareButtonsConfig(metaImage, metaTitle, metaDescription);
    this.loadUsersTop();
  }

  /**
   * @function loadUsersTop
   * @description Loads data for top users tables
   */
  private loadUsersTop() {
    this.userService.getTop().pipe(first()).subscribe(
      apiResponseUsersTop => {
        if (apiResponseUsersTop.ok) {
          this.usersTop = apiResponseUsersTop.usersTop;
          this.usersList = apiResponseUsersTop.users;
          this.userExamples = apiResponseUsersTop.exampleProfiles;
        } else {
          this.alertService.error(apiResponseUsersTop.msg);
        }
      },
      error => {
        this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
      });
  }

  /**
   * @function setCustomShareButtonsConfig
   * @description Sets custom configuration of share buttons
   */
  setCustomShareButtonsConfig(...options: any[]) {
    const [customImage, customTitle, customDescription] = options;
    this.customConfig = {
      image: customImage,
      title: customTitle,
      description: customDescription
    };
    ShareButtonsModule.withConfig(this.customConfig);
  }

}
