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

  /**
   * @function getCertificateProgress
   * @description Returns width of progress bar with the value of the current certficate progress
   */
  getCertificateProgress() {
    const myProgress = this.user.certificateProgress;
    if (myProgress !== null) {
      return {
        'width': `${myProgress}%`
      };
    }
  }
}
