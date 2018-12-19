import {User, Question, QuestionGroupsResult} from '@/_models';
import {TestTypeEnum, TestStatusEnum} from '@/_models/enum';

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
