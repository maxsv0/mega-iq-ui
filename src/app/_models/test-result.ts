import {Question, QuestionGroupsResult, User} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';
import {TestResultInfo} from '@/_models/test-result-info';
import {AnswerInfo} from '@/_models/answer-info';

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
  info: TestResultInfo;
  answerInfo: AnswerInfo[];
}
