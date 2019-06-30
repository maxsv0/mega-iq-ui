import {User} from '@/_models';
import {BehaviorSubject} from 'rxjs';

export class AppTestUtils {
  public mockUserEmpty() {
    console.log('Test with empty user');

    localStorage.removeItem('currentUser');

    const currentTokenSubject = new BehaviorSubject<string>(null);

    const currentUserSubject = new BehaviorSubject<User>(null);

    return {
      authState: currentUserSubject.asObservable(),
      idToken: currentTokenSubject.asObservable()
    };
  }

  public mockUser() {
    const testUser = new User();
    testUser.uid = 'ABC123';
    testUser.name = 'test';
    testUser.email = 'build-test@mega-iq.com';
    console.log('Test user:');
    console.log(testUser);

    const currentUserSubject = new BehaviorSubject<User>(testUser);

    const idToken = 'token-example';

    const currentTokenSubject = new BehaviorSubject<string>(idToken);

    return {
      authState: currentUserSubject.asObservable(),
      idToken: currentTokenSubject.asObservable()
    };
  }
}
