import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Modal } from '@/_models/modal';
import { resolve } from 'url';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class DialogService {
    private subject = new Subject<Modal>();
    dialogId: Modal["id"];

    constructor() { }

    public create({id, ...modalOptions}: Modal) {
        return new Promise<DialogService>((resolve, reject) => {
            this.dialogId = id;
            this.subject.next({id, ...modalOptions});
            resolve(this);
        });
    }

    public open() {
        this.tryOpen();
    }

    public close() {
        $('#' + this.dialogId).modal('hide');
    }

    public remove() {
        $('#' + this.dialogId).modal('dispose');
    }

    public getContent(): Observable<Modal> {
        return this.subject.asObservable();
    }

    private tryOpen() {
        if($('#' + this.dialogId).length) {
            $('#' + this.dialogId).modal('show');
        } else {
            const checkExist = setInterval(() => {
                if ($('#' + this.dialogId).length) {
                    $('#' + this.dialogId).modal('show');
                    clearInterval(checkExist);
                }
            }, 100);
        }
    }
}
