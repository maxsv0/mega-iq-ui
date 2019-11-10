import {TestResult, User} from '@/_models';

/**
 * @class ApiResponseTestResult
 * @description API response for test result
 */
export class ApiResponseTestResult {
  ok: boolean;
  msg: string;
  date: Date;
  test: TestResult;
  user: User;
}

