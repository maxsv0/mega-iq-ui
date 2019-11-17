import {TestResult} from '@/_models/test-result';
import {User} from '@/_models/user';

/**
 * @class ApiResponseTestResultList
 * @description API response for test result i.e. User home test lists
 */
export class ApiResponseTestResultList {
  ok: boolean;
  msg: string;
  date: Date;
  tests: TestResult[];
  user: User;
}

