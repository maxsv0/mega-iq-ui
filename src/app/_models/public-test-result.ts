import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';

/**
 * @class PublicTestResult
 * @description
 */
export class PublicTestResult {
  url: string;
  type: TestTypeEnum;
  status: TestStatusEnum;
  createDate: Date;
  finishDate: Date;
  points: number;
  progress: number;
  userPic: string;
  hasCertificate: boolean;
}
