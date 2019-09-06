import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, UserService} from '@/_services';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private titleService: Title,
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

    this.titleService.setTitle(this.i18n('Reset password for Mega-IQ account'));

    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgetForm.invalid) {
      return;
    }

    this.loading = true;

    this.loading = true;
    this.userService.forget(this.forgetForm.value)
      .pipe(first())
      .subscribe(
        apiResponse => {
          this.alertService.success(apiResponse.msg);
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }
}
