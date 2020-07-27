import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {createLocalStorage} from 'localstorage-ponyfill';

import {environment} from '../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';

/**
 * @class AuthenticationService
 * @description Signs in and authenticates user
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<firebase.User>;
  private currentUserSubject: BehaviorSubject<firebase.User>;
  private localStorage: any;

  // user token that is used to call API
  private currentToken: Observable<string>;
  private currentTokenSubject: BehaviorSubject<string>;

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth
  ) {
    this.localStorage = createLocalStorage();

    this.currentUserSubject = new BehaviorSubject<firebase.User>(JSON.parse(this.localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<string>(JSON.parse(this.localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.updateAuthData(user);
      } else {
        this.localStorage.setItem('user', JSON.stringify(null));
        this.currentUserSubject.next(null);
      }
    });

    this.firebaseAuth.idToken.subscribe(
      token => {
        this.localStorage.setItem('token', JSON.stringify(token));
        this.currentTokenSubject.next(token);
      }
    );
  }

  /**
   * @function currentUserValue
   * @description Returns current user value
   */
  public get currentUserValue(): firebase.User {
    if (this.currentUserSubject.value && Object.entries(this.currentUserSubject.value).length !== 0) {
      return this.currentUserSubject.value;
    } else {
      return null;
    }
  }

  public get currentTokenValue(): string {
    if (this.currentTokenSubject.value && Object.entries(this.currentTokenSubject.value).length !== 0) {
      return this.currentTokenSubject.value;
    } else {
      return null;
    }
  }

  /**
   * @function login
   * @param email User email
   * @param password User password
   * @description Logs in user with email
   */
  login(email: string, password: string) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password);
  }

  /**
   * @async
   * @function googleLogin
   * @description Logs in user with google
   */
  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.socialSignIn(provider);
  }

  /**
   * @function facebookLogin
   * @description Logs in user via facebook
   */
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  /**
   * @function socialSignIn
   * @param provider Google or facebook
   */
  private socialSignIn(provider) {
    return this.firebaseAuth.signInWithPopup(provider);
  }

  /**
   * @function loginToken
   * @param token Authentication token
   * @description Request user using token
   */
  loginToken(token: string) {
    return this.http.post<any>(environment.apiUrl + '/user/loginToken', {token})
      .pipe(map(apiResponseUser => {

        if (apiResponseUser.ok) {
          this.updateAuthData(apiResponseUser.user);
        }

        return apiResponseUser;
      }));
  }

  public requestIdToken(userCredential: firebase.User) {
    return userCredential.getIdToken(true);
  }

  /**
   * @function updateAuthData
   * @param user any
   * @description Sets current user in localstorage
   */
  updateAuthData(user: firebase.User) {
    this.localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return this.requestIdToken(user);
  }

  /**
   * @function logout
   * @description Logs user out and reomve user from local storage
   */
  logout() {
    return this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    });
  }

    public anonymousLogin(): Promise<firebase.User> {
        return new Promise<firebase.User>((resolve, reject) => {
            this.firebaseAuth.signInAnonymously()
            .then(userCredential => {
                this.updateAuthData(userCredential.user);
                resolve(userCredential.user);
            })
            .catch(error => {
                reject(error.message);
            });
        });
    }
}
