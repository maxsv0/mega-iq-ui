import {Question, QuestionGroupsResult, User} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';

/**
 * @class TestResult
 * @description Test after being sumitted listed on user home
 */
export class TestResult {
  code: string;
  url: string;
  user: User;
  type: TestTypeEnum;
  locale: string;
  status: TestStatusEnum;
  createDate: Date;
  updateDate: Date;
  finishDate: Date;
  points: number;
  progress: number;
  groupsGraph: QuestionGroupsResult;
  questionSet: Question[];
}
