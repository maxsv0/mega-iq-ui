import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

/**
 * @class AlertService
 * @description Shows a success or error message
 */
@Injectable({providedIn: 'root'})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  /**
   * @function success
   * @param message The message to be shown in the alert
   * @param keepAfterNavigationChange If message should persist after router change
   */
  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'success', text: message});
  }

  /**
   * @function error
   * @param message The message to be shown in the alert
   * @param keepAfterNavigationChange If message should persist after router change
   */
  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'error', text: message});
  }

  /**
   * @function getMessage
   * @description Getter for displaying message on respective page
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
