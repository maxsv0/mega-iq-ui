import {User} from '@/_models/user';

export class ApiResponseUsersList {
  ok: boolean;
  msg: string;
  date: Date;
  users: User[];
}

