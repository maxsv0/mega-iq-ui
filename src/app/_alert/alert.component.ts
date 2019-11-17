import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {AlertService} from '@/_services';

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['./alert.component.scss']
})

/**
 * @class AlertComponent
 * @implements OnInit, OnDestroy
 */
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {
  }

  /**
   * @function ngOnInit
   * @description Subsribes to the message and displays it one the respective page, disappears after 5 seconds
   */
  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
        this.message = message;
        if(this.message) {
            const self = this;
            setTimeout(() => {
                self.message = null;
            }, 5000);
        }
    });
  }

  /**
   * @function ngOnDestroy
   * @description Unsubscribes from subsribtion service
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
