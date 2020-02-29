import {Component, Input, OnInit} from '@angular/core';
import {User} from '@/_models';

/**
 * @class AvatarComponent
 * @implements OnInit
 * @description User profile card used when in home carousel and iq result
 */
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input()
  user: User;

  constructor() {
  }

  ngOnInit() {
  }

}
