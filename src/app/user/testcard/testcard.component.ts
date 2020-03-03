import {Component, Input, OnInit} from '@angular/core';
import {IqTest, TestResult} from '@/_models';
import {IqTestService} from '@/_services';
import {TestStatusEnum, TestTypeEnum} from '@/_models/enum';

@Component({
  selector: 'app-testcard',
  templateUrl: './testcard.component.html',
  styleUrls: ['./testcard.component.scss']
})
export class TestcardComponent implements OnInit {
  @Input()
  test: TestResult;

  @Input()
  deleteMethod: Function;

  loading = false;

  testTypes: IqTest[] = [];
  testTypesKeys: [] = [];

  public testStatus = TestStatusEnum;
  public testTypeEnum = TestTypeEnum;

  constructor(
    private iqTestService: IqTestService
  ) {
    this.iqTestService.getIqTest().subscribe(tests => {
      this.testTypes = tests;

      Object.entries(this.testTypes).forEach(
        ([key, test]) => {
          this.testTypesKeys[test.type] = key;
        }
      );
    });
  }

  ngOnInit() {
  }

  deleteTestResult(code: string) {
    this.loading = true;
    this.deleteMethod(code);
  }

}
