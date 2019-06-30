import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClassroomComponent} from './classroom.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppTestUtils} from '@/appTestUtils';

describe('ClassroomComponent', () => {
  let component: ClassroomComponent;
  let fixture: ComponentFixture<ClassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassroomComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: new AppTestUtils().mockUser()},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
