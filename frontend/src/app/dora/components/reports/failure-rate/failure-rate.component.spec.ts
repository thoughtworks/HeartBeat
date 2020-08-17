import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureRateComponent } from './failure-rate.component';

describe('FailureRateComponent', () => {
  let component: FailureRateComponent;
  let fixture: ComponentFixture<FailureRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FailureRateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
