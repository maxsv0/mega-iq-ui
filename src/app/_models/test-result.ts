import {User} from '@/_models/user';
import {TestTypeEnum} from '@/_models/enum/test-type.enum';
import {Question} from '@/_models/question';
import {QuestionGroupsResult} from '@/_models/question.groups';
import {TestStatusEnum} from '@/_models/enum/test-status.enum';

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
  points: number
  groupsGraph: QuestionGroupsResult;
  questionSet: Question[];
}
