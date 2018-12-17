import {TestTypeEnum} from '@/_models/enum';

export class IqTest {
  type: TestTypeEnum;
  name: string;
  url: string;
  pic: string;
  duration: string;
  description: string;
}
