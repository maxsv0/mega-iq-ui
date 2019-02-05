import {TestResult} from '@/_models/test-result';
import {User} from '@/_models/user';

export class ApiResponseTestResultList {
  ok: boolean;
  msg: string;
  date: Date;
  tests: TestResult[];
  user: User;
}

