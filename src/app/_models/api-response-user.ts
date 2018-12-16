import {User} from '@/_models';

export class ApiResponseUser {
  ok: boolean;
  msg: string;
  date: Date;
  user: User;
}

