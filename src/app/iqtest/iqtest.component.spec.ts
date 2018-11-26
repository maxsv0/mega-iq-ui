import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqtestComponent } from './iqtest.component';

describe('IqtestComponent', () => {
  let component: IqtestComponent;
  let fixture: ComponentFixture<IqtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqtestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
