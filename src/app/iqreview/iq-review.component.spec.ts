import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IqReviewComponent } from './iq-review.component';

describe('IqReviewComponent', () => {
  let component: IqReviewComponent;
  let fixture: ComponentFixture<IqReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IqReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
