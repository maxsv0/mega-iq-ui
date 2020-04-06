import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from '@/_services';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    id: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    clickFunction: Function;
    close: boolean = true;

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
      this.subscription = this.dialogService.getContent().subscribe(modal => {
        this.id = modal.id;
        this.title = modal.title;
        this.body = modal.body;
        this.primary = modal.primary;
        this.clickFunction = modal.clickFunction;
        this.close = modal.close;
      });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  handleClick() {
    this.clickFunction();
    this.dialogService.close();
  }

}
