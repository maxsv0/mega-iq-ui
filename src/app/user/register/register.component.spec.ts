import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppTestUtils} from '@/appTestUtils';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: new AppTestUtils().mockUserEmpty()},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
