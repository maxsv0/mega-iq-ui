import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisteranonComponent } from './registeranon.component';

describe('RegisteranonComponent', () => {
  let component: RegisteranonComponent;
  let fixture: ComponentFixture<RegisteranonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteranonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteranonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
