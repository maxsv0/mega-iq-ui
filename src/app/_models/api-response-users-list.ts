import {User} from '@/_models';

/**
 * @class ApiResponseUsersList
 * @description Used to list all users i.e. Top scores by user
 */
export class ApiResponseUsersList {
  ok: boolean;
  msg: string;
  date: Date;
  users: User[];
  count: number;
}

