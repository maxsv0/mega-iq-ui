import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitted = false;
  avatarsDefault = [];

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private http: HttpClient,
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
    this.avatarsDefault = this.userService.getAvatarsDefault();

    this.profileForm = this.formBuilder.group({
      id: [this.currentUser.id],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      name: [this.currentUser.name, Validators.required],
      age: [this.currentUser.age],
      location: [this.currentUser.location],
      isPublic: [this.currentUser.isPublic],
      pic: [this.currentUser.pic]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
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
        apiResponseUser => {
          if (apiResponseUser.ok) {
            this.authenticationService.update(apiResponseUser.user);
            this.alertService.success('Successfully saved', true);
            this.router.navigate(['/user/' + this.currentUser.id]);
          } else {
            this.alertService.error(apiResponseUser.msg);
            this.loading = false;
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  detectLocation() {
    this.http.get(environment.apiUrl + '/ip').subscribe(data => {
      this.profileForm.controls['location'].setValue(data);
    });
  }
}
