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
import firebase from 'firebase/app';

@Component({
    selector: 'app-registeranon',
    templateUrl: './registeranon.component.html',
    styleUrls: ['./registeranon.component.scss']
})
export class RegisteranonComponent implements AfterViewInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;
    uploadPic = '';
    isBrowser: boolean;
    showPassword = false;
    currentUser: firebase.User;

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
        this.currentUser = this.authenticationService.currentUserValue;

        if (this.currentUser && !this.currentUser.isAnonymous) {
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

        if (this.registerForm.invalid) { return; }
        this.loading = true;

        this.authenticationService
        .anonEmailLogin(this.registerForm.get(['email']).value, this.registerForm.get(['password']).value)
        .then(user => {
            this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                response => {
                    if (response.ok) {
                        this.alertService.success('Registration was successful. You can now log in.', true);
                        if (response.user) {
                            if (!response.user.token && !response.user.password) {
                                this.router.navigate(['/login']);
                            } else {
                                this.googleAnalyticsService.sendEvent('user', 'register');
                                this.router.navigate(['/home']);
                            }
                        }
                    } else {
                        this.alertService.error(response.msg);
                        this.loading = false;
                    }
                },
                error => {
                    this.alertService.error(`${this.i18n('API Service Unavailable')}. ${error.message}`);
                    this.loading = false;
                }
            );
            this.loading = false;
        })
        .catch(error => {
            this.alertService.error(error);
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
            this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error.message);
            this.loading = false;
        });
    }

    showHidePassword() {
        this.showPassword = !this.showPassword;
    }

    /**
    * @function loginGoogle
    * @description Google log in
    */
    loginGoogle() {
        this.authenticationService.anonGoogleLogin()
        .then(user => {
            this.googleAnalyticsService.sendEvent('user', 'register');
            this.router.navigate(['/home']);
        })
        .catch(error => {
            this.alertService.error(error);
        });
    }

    /**
     * @function loginFacebook
     * @description Link anonymous user with FB account
     */
    loginFacebook() {
        this.authenticationService.anonFbLogin()
        .then(user => {
            this.googleAnalyticsService.sendEvent('user', 'register');
            this.router.navigate(['/home']);
        })
        .catch(error => {
            this.alertService.error(error);
        });
    }

}
