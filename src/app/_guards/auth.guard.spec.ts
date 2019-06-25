import {inject, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppTestUtils} from '@/appTestUtils';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: AngularFireAuth, useValue: new AppTestUtils().mockUser()},
      ],
      imports: [RouterTestingModule, HttpClientModule]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
