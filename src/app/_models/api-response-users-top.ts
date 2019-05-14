import {User} from '@/_models';

export class ApiResponseUsersTop {
  ok: boolean;
  msg: string;
  date: Date;
  users: User[];
  usersTop: User[];
  count: number;
}

