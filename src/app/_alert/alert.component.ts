import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {AlertService} from '@/_services';

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {
  }

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
