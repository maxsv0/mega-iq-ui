import {TestResult} from '@/_models/test-result';

export class ApiResponseTestResultList {
  ok: boolean;
  msg: string;
  date: Date;
  tests: TestResult[];
}

