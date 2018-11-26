import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitted = false;

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      id: [this.currentUser.id],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      name: [this.currentUser.name, Validators.required],
      age: [this.currentUser.age],
      location: [this.currentUser.location],
      isPublic: [this.currentUser.isPublic],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.update(this.profileForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Successfully saved', true);
          this.router.navigate(['/user/' + this.currentUser.id]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


}
