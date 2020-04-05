import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class DialogService {
    private subject = new Subject<any>();
    dialogId: string;

    constructor() { }

    public create({id, ...modalOptions}) {
        this.dialogId = id;
        this.subject.next({id, ...modalOptions});
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

    public getContent(): Observable<any> {
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
