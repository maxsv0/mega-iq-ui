import {Component, Input} from '@angular/core';
import {User} from '@/_models';

/**
 * @class ProfileComponent
 * @description User profile used for user home and user public profile
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input()
  user: User;
}
