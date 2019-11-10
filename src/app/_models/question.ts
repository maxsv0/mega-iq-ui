import {Answer} from '@/_models';

/**
 * @class Question
 * @description Model for a single user after being submitted
 */
export class Question {
  pic: string;
  pic2x: string;
  answerCorrect: number;
  answerUser: number;
  title: string;
  description: string;
  updateDate: Date;
  answers: Answer[];
}
