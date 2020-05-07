import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqReviewComponent } from './iq-review.component';

describe('IqReviewComponent', () => {
  let component: IqReviewComponent;
  let fixture: ComponentFixture<IqReviewComponent>;

  beforeEach(async(() => {
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
