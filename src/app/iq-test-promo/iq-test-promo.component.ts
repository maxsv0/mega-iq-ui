import {Component, Input} from '@angular/core';
import {IqTest} from '@/_models';

@Component({
  selector: 'app-iq-test-promo',
  templateUrl: './iq-test-promo.component.html',
  styleUrls: ['./iq-test-promo.component.scss']
})
export class IqTestPromoComponent {

  @Input()
  test: IqTest;

  constructor() {
  }

}
