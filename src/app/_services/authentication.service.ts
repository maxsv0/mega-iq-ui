import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';

/**
 * @class AuthenticationService
 * @description Signs in and authenticates user
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<firebase.User>;
  private currentUserSubject: BehaviorSubject<firebase.User>;

  // user token that is used to call API
  private currentToken: Observable<string>;
  private currentTokenSubject: BehaviorSubject<string>;

  constructor(
    private firebaseAuth: AngularFireAuth
  ) {

    this.currentUserSubject = new BehaviorSubject<firebase.User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.updateAuthData(user);
      } else {
        localStorage.setItem('user', JSON.stringify(null));
        this.currentUserSubject.next(null);
      }
    });

    this.firebaseAuth.idToken.subscribe(
      token => {
        localStorage.setItem('token', JSON.stringify(token));
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
    return null;
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
    localStorage.setItem('user', JSON.stringify(user));
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
      localStorage.removeItem('user');
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

    public anonEmailLogin(email: string, password: string): Promise<firebase.User> {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        return this.linkAccount(credential);
    }

    public anonGoogleLogin(): Promise<firebase.User> {
        let idToken: string;
        this.googleLogin().then(user => {
            idToken = (<any>user).credential.idToken;
        });
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        return this.linkAccount(credential);
    }

    public anonFbLogin(): Promise<firebase.User> {
        let accessToken: string;
        this.facebookLogin().then(user => {
            accessToken = (<any>user).credential.accessToken;
        });
        const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
        return this.linkAccount(credential);
    }

    private linkAccount(credential: firebase.auth.AuthCredential): Promise<firebase.User> {
        return new Promise<firebase.User>((resolve, reject) => {
            this.firebaseAuth.currentUser
            .then(user => {
                user.linkWithCredential(credential)
                .then(userCred => {
                    resolve(userCred.user);
                })
                .catch(error => {
                    reject(error.message);
                });
            });
        });
    }
}
