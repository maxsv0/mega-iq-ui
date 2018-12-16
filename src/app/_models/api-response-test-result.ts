import {TestResult} from '@/_models';

export class ApiResponseTestResult {
  ok: boolean;
  msg: string;
  date: Date;
  test: TestResult;
}

