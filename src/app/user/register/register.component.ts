import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, StorageService, UserService} from '@/_services';
import {HttpClient} from '@angular/common/http';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm: FormGroup;
  loading = false;
  uploading = false;
  submitted = false;
  avatarsDefault = [];
  uploadPic = '';

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private storageService: StorageService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.avatarsDefault = this.userService.getAvatarsDefault();

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      age: [''],
      location: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      isPublic: [true],
      pic: [this.avatarsDefault[0]],
      terms: [true, Validators.required]
    });
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

    if (this.uploadPic) {
      this.registerForm.controls['pic'].setValue(this.uploadPic);
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        apiResponseUser => {
          if (apiResponseUser.ok) {
            this.alertService.success('Registration successful', true);
            this.authenticationService.update(apiResponseUser.user);
            this.router.navigate(['/home']);
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
    this.loading = true;
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
            this.alertService.error('API Service Unavailable. ' + error);
            this.uploading = false;
          });
    }
  }
}
