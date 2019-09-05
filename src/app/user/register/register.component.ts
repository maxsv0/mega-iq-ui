import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, UserService} from '@/_services';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  uploadPic = '';

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      terms: [true, Validators.required]
    });
  }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

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
                      this.authenticationService.storeFirebaseUser(data.user);
                      this.router.navigate(['/home']);
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
          this.alertService.error('API Service Unavailable. ' + error);
          this.loading = false;
        });
  }

  ngAfterViewInit() {
    this.detectLocation();
  }

  detectLocation() {
    this.userService.detectLocation().subscribe(
      apiResponseBase => {
        if (apiResponseBase.ok) {
          this.registerForm.controls['location'].setValue(apiResponseBase.msg);
        } else {
          this.alertService.error(apiResponseBase.msg);
        }
        this.loading = false;
      },
      error => {
        console.log('API Service Unavailable. ' + error);
        this.loading = false;
      });
  }

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
