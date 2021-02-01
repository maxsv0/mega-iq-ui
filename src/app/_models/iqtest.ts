import {TestTypeEnum} from '@/_models/enum';

/**
 * @class IqTest
 * @description Model for a single test
 */
export class IqTest {
  type: TestTypeEnum;
  name: string;
  url: string;
  pic: string;
  description: string;
  title: string;
  questions: number;
  time: number;
  expire: number;
  styleName: string;
}
