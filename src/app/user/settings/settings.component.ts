import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import {User} from '@/_models';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '@/_services/storage.service';
import {Title} from '@angular/platform-browser';
import {I18n} from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  profileForm: FormGroup;
  loading = false;
  uploading = false;
  submitted = false;
  avatarsDefault = [];
  uploadPic = '';
  isLoading = false;
  bgPicker = [];

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private storageService: StorageService,
    private alertService: AlertService,
    private i18n: I18n
  ) {
    this.titleService.setTitle(this.i18n('Mega-IQ is loading..'));

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    const code = this.route.snapshot.params['verifyCode'];
    if (code) {
      this.sendVerifyEmailCheck(code);
    }

    this.avatarsDefault = this.userService.getAvatarsDefault();
  }

  private async loadUserProfile() {
    this.isLoading = true;
    await this.userService.getMyInfo()
      .pipe(first())
      .subscribe(
        apiResponseUser => {
          if (apiResponseUser.ok) {
            this.currentUser = apiResponseUser.user;
            console.log(this.currentUser);

            // in case data is loaded after page init
            this.profileForm.controls['id'].setValue(this.currentUser.id);
            this.profileForm.controls['email'].setValue(this.currentUser.email);
            this.profileForm.controls['name'].setValue(this.currentUser.name);
            this.profileForm.controls['age'].setValue(this.currentUser.age);
            if (this.currentUser.location) {
              this.profileForm.controls['location'].setValue(this.currentUser.location);
            }
            this.profileForm.controls['isPublic'].setValue(this.currentUser.isPublic);
            this.profileForm.controls['pic'].setValue(this.currentUser.pic);
            this.profileForm.controls['background'].setValue(this.currentUser.background);
          } else {
            this.alertService.error(apiResponseUser.msg);
          }
          this.isLoading = false;

          this.titleService.setTitle(this.i18n('Edit Profile {{name}}', {name: this.currentUser.name}));
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.isLoading = false;
        });
  }

  ngOnInit() {
    console.log('Build form for user ID ' + this.currentUser.email);
    this.profileForm = this.formBuilder.group({
      id: [this.currentUser.id],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      name: [this.currentUser.name, Validators.required],
      age: [this.currentUser.age],
      location: [this.currentUser.location],
      isPublic: [this.currentUser.isPublic],
      isUnsubscribed: [this.currentUser.isUnsubscribed],
      pic: [this.currentUser.pic],
      background: [this.currentUser.background]
    });
    console.log(this.profileForm, 'profile form');
    console.log('Build form done');

    this.bgPicker = [
        'custom-bg1', 
        'custom-bg2', 
        'custom-bg3', 
        'custom-bg4',
        'custom-bg5',
        'custom-bg6', 
        'custom-bg7', 
        'custom-bg8', 
        'custom-bg9',
        'custom-bg10'
    ];

    this.loadUserProfile();
  }

  ngAfterViewInit() {
    console.log('location: ' + this.currentUser.location);
    if (this.currentUser.location == null) {
      this.detectLocation();
    }
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
    console.log(this.profileForm, 'updating...');

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
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }

  detectLocation() {
    this.loading = true;
    this.userService.detectLocation().subscribe(
      apiResponseBase => {
        if (apiResponseBase.ok) {
          this.profileForm.controls['location'].setValue(apiResponseBase.msg);
        } else {
          this.alertService.error(apiResponseBase.msg);
        }
        this.loading = false;
      },
      error => {
        console.log('API error: ' + error);
        this.loading = false;
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
            this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
            this.uploading = false;
          });
    }
  }

  sendVerifyEmail() {
    this.loading = true;
    this.userService.verifyEmail()
      .pipe(first())
      .subscribe(
        apiResponse => {
          if (apiResponse.ok) {
            this.alertService.success(apiResponse.msg);
          } else {
            this.alertService.error(apiResponse.msg);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }

  sendVerifyEmailCheck(code: string) {
    this.loading = true;
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
          this.loading = false;
        },
        error => {
          this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error);
          this.loading = false;
        });
  }
  
}
