import {TestTypeEnum} from '@/_models/enum';

export class IqTest {
  type: TestTypeEnum;
  name: string;
  url: string;
  pic: string;
  description: string;
  questions: number;
  time: number;
  expire: number;
  styleName: string;
}
