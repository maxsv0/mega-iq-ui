import {PublicTestResult} from '@/_models/public-test-result';

/**
 * @class ApiResponseTestResultList
 * @description API response for test result i.e. User home test lists
 */
export class ApiResponsePublicTestResultList {
  ok: boolean;
  msg: string;
  date: Date;
  locale: string;
  testsActive: PublicTestResult[];
  tests: PublicTestResult[];
  count: number;
}

