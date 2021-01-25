import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppTestUtils} from '@/appTestUtils';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: new AppTestUtils().mockUser()},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
