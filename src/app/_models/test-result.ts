import {Question, QuestionGroupsResult, User} from '@/_models';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';

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
  groupsGraph: QuestionGroupsResult;
  questionSet: Question[];
}
