import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {IqTestComponent} from './iq-test.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('IqTestComponent', () => {
  let component: IqTestComponent;
  let fixture: ComponentFixture<IqTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IqTestComponent],
      imports: [HttpClientModule, RouterTestingModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
