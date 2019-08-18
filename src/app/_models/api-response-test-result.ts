import {TestResult, User} from '@/_models';

export class ApiResponseTestResult {
  ok: boolean;
  msg: string;
  date: Date;
  test: TestResult;
  user: User;
}

