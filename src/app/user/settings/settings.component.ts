import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '@/_services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  uploading = false;
  submitted = false;
  avatarsDefault = [];
  uploadPic = '';

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private storageService: StorageService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    const code = this.route.snapshot.params['verifyCode'];
    if (code) {
      this.sendVerifyEmailCheck(code);
    }
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

    if (this.uploadPic) {
      this.profileForm.controls['pic'].setValue(this.uploadPic);
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
          this.alertService.error('API error: ' + error);
          this.loading = false;
        });
  }

  detectLocation() {
    this.http.get(environment.apiUrl + '/ip').subscribe(data => {
      this.profileForm.controls['location'].setValue(data);
    });
  }

  handleFileInput(files: FileList) {
    let fileToUpload: File = null;
    fileToUpload = files.item(0);
    if (fileToUpload) {
      this.uploading = true;
      this.storageService.uploadFile(fileToUpload)
        .pipe(first())
        .subscribe(
          apiResponseBase => {
            if (apiResponseBase.ok) {
              this.uploadPic = apiResponseBase.msg;
            } else {
              this.alertService.error(apiResponseBase.msg);
            }
            this.uploading = false;
          },
          error => {
            this.alertService.error('API error: ' + error);
            this.uploading = false;
          });
    }
  }

  sendVerifyEmail() {
    this.userService.verifyEmail()
      .pipe(first())
      .subscribe(
        apiResponse => {
          if (apiResponse.ok) {
            this.alertService.success(apiResponse.msg);
          } else {
            this.alertService.error(apiResponse.msg);
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
        });
  }

  sendVerifyEmailCheck(code: string) {
    this.userService.verifyEmailCheck(code)
      .pipe(first())
      .subscribe(
        apiResponse => {
          if (apiResponse.ok) {
            this.currentUser.isEmailVerified = true;
            this.alertService.success(apiResponse.msg);
          } else {
            this.alertService.error(apiResponse.msg);
          }
        },
        error => {
          this.alertService.error('API error: ' + error);
        });
  }
}
