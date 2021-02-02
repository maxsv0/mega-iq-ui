import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqTestPromoComponent } from './iq-test-promo.component';

describe('IqTestPromoComponent', () => {
  let component: IqTestPromoComponent;
  let fixture: ComponentFixture<IqTestPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IqTestPromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IqTestPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
