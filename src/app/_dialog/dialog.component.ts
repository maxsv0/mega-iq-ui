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
    public id: string;
    public title: string;
    public body: string;
    public primary: string;
    public secondary: string;
    public clickFunctionPrimary: Function;
    public clickFunctionSecondary: Function;
    public close: boolean = true;

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
      this.subscription = this.dialogService.getContent().subscribe(modal => {
        this.id = modal.id;
        this.title = modal.title;
        this.body = modal.body;
        this.primary = modal.primary;
        this.secondary = modal.secondary;
        this.clickFunctionPrimary = modal.clickFunctionPrimary;
        this.clickFunctionSecondary = modal.clickFunctionSecondary;
        this.close = modal.close;
      });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  handleClickPrimary() {
    this.clickFunctionPrimary();
    this.dialogService.close();
  }

  handleClickSecondary() {
    this.clickFunctionSecondary();
    this.dialogService.close();
  }

}
