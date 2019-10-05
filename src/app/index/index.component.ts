import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {first} from 'rxjs/operators';
import {AlertService, IqTestService, UserService} from '@/_services';
import {IqTest, User} from '@/_models';
import * as $ from 'jquery';
import {interval, Subscription} from 'rxjs';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Title} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss', './flipclock.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, OnDestroy {
  testTypes: IqTest[] = [];
  usersList: User[] = [];
  usersTop: User[] = [];
  userExamples: User[];
  clock: any;
  clockTimerSubscription: Subscription;
  clockSpeed: number;
  isBrowser: boolean;

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
    private iqTestService: IqTestService,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;
    });
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.titleService.setTitle(this.i18n('Mega-IQ free online IQ test'));

    this.loadUsersTop();
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initJs();
    }
  }

  ngOnDestroy() {
    if (this.clockTimerSubscription) {
      this.clockTimerSubscription.unsubscribe();
    }
  }

  private initJs() {
    // @ts-ignore
    this.clock = new FlipClock($('#counter'), 1481181, {
      clockFace: 'Counter',
      minimumDigits: 7,
      autoStart: true,
      countdown: false
    });
  }

  private loadUsersTop() {
    this.userService.getTop().pipe(first()).subscribe(
      apiResponseUsersTop => {
        if (apiResponseUsersTop.ok) {
          this.usersTop = apiResponseUsersTop.usersTop;
          this.usersList = apiResponseUsersTop.users;
          this.userExamples = apiResponseUsersTop.exampleProfiles;
          console.log(this.userExamples);
        } else {
          this.alertService.error(apiResponseUsersTop.msg);
        }
        this.scrollToValue(apiResponseUsersTop.count + 1481181 + 1000);
      },
      error => {
        this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
      });
  }

  private scrollToValue(value: number) {
    if (value == null) {
      return;
    }
    if (this.clock == null) {
      return;
    }

    // scroll in 5 sec
    const diff = value - this.clock.getTime().getTimeSeconds();
    if (diff < 0) {
      return false;
    }

    this.clockSpeed = Math.round(diff / 57);

    const diffLimitSlow = Math.round(value - diff * 0.03);
    const diffLimitSlow2 = Math.round(value - diff * 0.14);
    const source = interval(25);

    this.clockTimerSubscription = source.subscribe(
      val => {
        const counter = this.clock.getTime().getTimeSeconds();
        for (let i = 0; i < this.clockSpeed; i++) {
          this.clock.increment();
        }
        if (this.clockSpeed > 2 && counter >= diffLimitSlow2) {
          this.clockSpeed = Math.round(this.clockSpeed / 2);
        }
        if (this.clockSpeed > 1 && counter >= diffLimitSlow) {
          this.clockSpeed = 1;
        }
        if (counter >= value) {
          this.clockTimerSubscription.unsubscribe();
        }
      }
    );
  }

}
