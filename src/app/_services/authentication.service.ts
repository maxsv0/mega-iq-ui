import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {createLocalStorage} from 'localstorage-ponyfill';

import {User} from '@/_models';
import {environment} from '../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  private localStorage: any;

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth
  ) {
    this.localStorage = createLocalStorage();

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    firebaseAuth.authState.subscribe(
      userCredential => {
        this.storeFirebaseUser(userCredential);
      }
    );

    this.firebaseAuth.idToken.subscribe(
      token => {
        const user = JSON.parse(this.localStorage.getItem('currentUser'));
        if (user !== null && Object.entries(user).length !== 0) {
          user.token = token;
          this.update(user);
        }
      }
    );
  }

  public get currentUserValue(): User {
    if (this.currentUserSubject.value && Object.entries(this.currentUserSubject.value).length !== 0) {
      return this.currentUserSubject.value;
    } else {
      return null;
    }
  }

  login(email: string, password: string) {
    return this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password);
  }

  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.storeFirebaseUser(credential.user);
      })
      .catch(error => console.log(error));
  }

  loginToken(token: string) {
    return this.http.post<any>(environment.apiUrl + '/user/loginToken', {token})
      .pipe(map(apiResponseUser => {

        // login successful if there's a jwt token in the response
        if (apiResponseUser.ok) {
          this.update(apiResponseUser.user);
        }

        return apiResponseUser;
      }));
  }

  public storeFirebaseUser(userCredential: firebase.User) {
    let user = null;
    if (userCredential !== null) {
      user = new User();
      user.uid = userCredential.uid;
      user.email = userCredential.email;
      user.name = userCredential.displayName;
      user.isEmailVerified = userCredential.emailVerified;
      user.pic = userCredential.photoURL;

      this.update(user);
    }
  }

  update(user: User) {
    console.log('update storage with user: ' + user.uid);
    this.localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
    this.localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
