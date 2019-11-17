import {User} from '@/_models';

/**
 * @class ApiResponseUser
 * @description API response for a current user
 */
export class ApiResponseUser {
  ok: boolean;
  msg: string;
  date: Date;
  user: User;
}

