import {User} from '@/_models/user';

export class ApiResponseUser {
  ok: boolean;
  msg: string;
  date: Date;
  user: User;
}

