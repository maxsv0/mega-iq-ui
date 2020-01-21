import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService} from '@/_services';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';
import * as firebase from 'firebase';

/**
 * @class LoginComponent
 * @description Login page
 */
@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    // // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate([this.returnUrl]);
    // }

    this.titleService.setTitle(this.i18n('Log In to Mega-IQ'));

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.loading = true;
      this.authenticationService.loginToken(token)
        .pipe(first())
        .subscribe(
          apiResponseUser => {
            if (apiResponseUser.ok) {
              this.router.navigate([this.returnUrl]);
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
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * @function loginGoogle
   * @description Logs in with google
   */
  loginGoogle() {
    this.authenticationService.googleLogin()
      .then(data => {
        this.storeUserAndNavigate(data);
      })
      .catch(data => {
        this.alertService.error(data.message);
        this.loading = false;
      });
  }

  /**
   * @function loginFacebook
   * @description Log in with facebook
   */
  loginFacebook() {
    this.authenticationService.facebookLogin()
      .then(data => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      })
      .catch(data => {
        this.alertService.error(data.message);
        this.loading = false;
      });
  }

  /**
   * @function onSubmit
   * @description Authenticates user via firebase and redirects to user home
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .then(data => {
        this.storeUserAndNavigate(data);
      })
      .catch(data => {
        this.alertService.error(data.message);
        this.loading = false;
      });
  }

  private storeUserAndNavigate(userCredential: firebase.auth.UserCredential) {
    const user = this.authenticationService.storeFirebaseUser(userCredential.user);

    this.authenticationService.requestIdToken(userCredential.user).then(idToken => {
      user.token = idToken;
      this.authenticationService.update(user);

      this.loading = false;
      this.router.navigate([this.returnUrl]);
    });
  }
}
