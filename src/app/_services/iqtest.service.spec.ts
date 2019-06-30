import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {IqTestService} from '@/_services/iqtest.service';

describe('IqtestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: IqTestService = TestBed.get(IqTestService);
    expect(service).toBeTruthy();
  });
});
