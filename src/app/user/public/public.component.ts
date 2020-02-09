import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, IqTestService, UserService} from '@/_services';
import {IqTest, TestResult, User} from '@/_models';
import {first} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {TestTypeEnum} from '@/_models/enum';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {HttpClientModule} from '@angular/common/http';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {ShareButtonsConfig} from '@ngx-share/core';
import {isPlatformBrowser} from '@angular/common';

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
  userTestsPage = 0;
  testTypeEnum = TestTypeEnum;
  isBrowser: boolean;
  customConfig: ShareButtonsConfig;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private iqTestService: IqTestService,
    private userService: UserService,
    private alertService: AlertService,
    private httpClientModule: HttpClientModule,
    private shareButtonsModule: ShareButtonsModule,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const userId = this.route.snapshot.params['userId'];
    if (userId == null) {
      return;
    }

    this.userId = userId;

    this.isBrowser = isPlatformBrowser(this.platformId);

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

    this.userService.getById(this.userId, this.userTestsPage)
      .pipe(first())
      .subscribe(
        apiResponseTestResultList => {
          if (apiResponseTestResultList.ok) {
            if (!this.user) {
              this.user = apiResponseTestResultList.user;
              this.setTitle(this.user.name, this.user.iq, this.user.location);

                const customShareImage = (this.user.certificate !== null) ? this.user.certificate : this.user.pic;
                this.setCustomShareButtonsConfig(customShareImage, this.titleService.getTitle());
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
    console.log('Load page ' + this.userTestsPage + '  scrolled down!!');

    this.loadUserResult();
  }

  /**
   * @function setTitle
   * @param name User name
   * @param iq User IQ 
   * @param location User location
   * @description Sets title for user public profile
   */
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

    /**
     * @function setCustomShareButtonsConfig
     * @description Sets custom configuration of share buttons
     */
    setCustomShareButtonsConfig(...options: any[]) {
        const [imageOption, titleOption] = options;
        this.customConfig = {
            image: imageOption,
            title: titleOption
        }
        ShareButtonsModule.withConfig(this.customConfig);
    }

}
