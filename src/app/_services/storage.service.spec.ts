import {TestBed} from '@angular/core/testing';
import {StorageService} from './storage.service';
import {HttpClientModule} from '@angular/common/http';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });
});
