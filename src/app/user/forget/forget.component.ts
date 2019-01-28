import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, UserService} from '@/_services';

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
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
          this.alertService.error('API Service Unavailable. ' + error);
          this.loading = false;
        });
  }
}
