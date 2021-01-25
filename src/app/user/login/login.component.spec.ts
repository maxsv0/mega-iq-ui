import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {AppTestUtils} from '@/appTestUtils';
import {AngularFireAuth} from '@angular/fire/auth';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: new AppTestUtils().mockUserEmpty()},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
