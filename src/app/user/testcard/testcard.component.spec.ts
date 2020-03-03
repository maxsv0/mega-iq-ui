import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcardComponent } from './testcard.component';

describe('TestcardComponent', () => {
  let component: TestcardComponent;
  let fixture: ComponentFixture<TestcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
