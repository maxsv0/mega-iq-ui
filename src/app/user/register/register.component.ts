import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, UserService} from '@/_services';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {isPlatformBrowser} from '@angular/common';
import {GoogleAnalyticsService} from '@/_services/google-analytics.service';

/**
 * @class RegisterComponent
 * @implements AfterViewInit
 * @description User register page
 */
@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  uploadPic = '';
  isBrowser: boolean;

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private i18n: I18n,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }

    this.titleService.setTitle(this.i18n('Register on Mega-IQ'));

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      age: [''],
      location: [''],
      country: [''],
      cityLatLong: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      terms: [true, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * @function onSubmit
   * @description Generates user token and stores user data, navigates to user home after success
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        apiResponseUser => {
          if (apiResponseUser.ok) {
            this.alertService.success('Registration was successful. You can now log in.', true);

            if (apiResponseUser.user) {
              // user doesn't has access token at this point and need to log in
              if (apiResponseUser.user.token == null) {
                if (apiResponseUser.user.password == null) {
                  this.router.navigate(['/login']);
                } else {
                  // we have a password and could login
                  this.authenticationService.login(apiResponseUser.user.email, apiResponseUser.user.password)
                    .then(data => {
                      const user = this.authenticationService.storeFirebaseUser(data.user);

                      this.authenticationService.requestIdToken(data.user).then(idToken => {
                        user.token = idToken;
                        this.authenticationService.update(user);

                        this.router.navigate(['/home']);

                        this.googleAnalyticsService.sendEvent('user', 'register');
                      });
                    })
                    .catch(data => {
                      this.alertService.error(data.message);
                      this.loading = false;
                    });
                }
              } else {
                this.router.navigate(['/home']);
              }
            }
          } else {
            this.alertService.error(apiResponseUser.msg);
            this.loading = false;
          }
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }

  /**
   * @function ngAfterViewInit
   * @description Detects user location
   */
  ngAfterViewInit() {
    if (this.isBrowser) {
      this.detectLocation();
    }
  }

  /**
   * @function detectLocation
   * @description Detects user's location and sets them to location field
   */
  detectLocation() {
    this.userService.detectLocation().subscribe(
      apiResponseGeoIp => {
        if (apiResponseGeoIp.ok) {
          this.registerForm.controls['location'].setValue(apiResponseGeoIp.location);
          this.registerForm.controls['country'].setValue(apiResponseGeoIp.country);
          this.registerForm.controls['cityLatLong'].setValue(apiResponseGeoIp.cityLatLong);
        } else {
          this.alertService.error(apiResponseGeoIp.msg);
        }
        this.loading = false;
      },
      error => {
        this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
        this.loading = false;
      });
  }

  /**
   * @function loginGoogle
   * @description Google log in
   */
  loginGoogle() {
    this.authenticationService.googleLogin()
      .then(data => {
        this.loading = false;
        this.router.navigate(['/home']);
      })
      .catch(data => {
        this.alertService.error(data.message);
        this.loading = false;
      });
  }
}
