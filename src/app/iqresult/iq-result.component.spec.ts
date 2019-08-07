import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IqResultComponent} from './iq-result.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('IqResultComponent', () => {
  let component: IqResultComponent;
  let fixture: ComponentFixture<IqResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IqResultComponent],
      imports: [HttpClientModule, RouterTestingModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
