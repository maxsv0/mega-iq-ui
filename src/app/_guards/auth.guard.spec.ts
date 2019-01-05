import {TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
  });

  // TODO: inject parameters to constructor
  // it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  //   expect(guard).toBeTruthy();
  // }));
});
