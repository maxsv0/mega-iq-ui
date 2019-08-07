import {TestBed} from '@angular/core/testing';

import {AuthenticationService} from './authentication.service';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppTestUtils} from '@/appTestUtils';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      {provide: AngularFireAuth, useValue: new AppTestUtils().mockUser()},
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
