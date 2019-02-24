import {Answer} from '@/_models';

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
