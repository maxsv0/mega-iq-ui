import {User} from '@/_models';

/**
 * @class ApiResponseUsersTop
 * @description Uses a user in order to display example profiles on home page
 */
export class ApiResponseUsersTop {
  ok: boolean;
  msg: string;
  date: Date;
  users: User[];
  usersTop: User[];
  count: number;
  exampleProfiles: User[];
}

