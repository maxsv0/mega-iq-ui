import {User} from '@/_models';

export class ApiResponseUsersList {
  ok: boolean;
  msg: string;
  date: Date;
  users: User[];
  count: number;
}

