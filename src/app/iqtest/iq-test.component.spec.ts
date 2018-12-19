import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqTestComponent } from './iq-test.component';

describe('IqTestComponent', () => {
  let component: IqTestComponent;
  let fixture: ComponentFixture<IqTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqTestComponent ]
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
