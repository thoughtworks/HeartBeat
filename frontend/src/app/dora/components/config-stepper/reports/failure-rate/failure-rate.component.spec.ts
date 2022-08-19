import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureRateReportComponent } from './failure-rate.component';

describe('FailureRateComponent', () => {
  let component: FailureRateReportComponent;
  let fixture: ComponentFixture<FailureRateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FailureRateReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureRateReportComponent);
    component = fixture.componentInstance;
    component.failureRate = {
      avgChangeFailureRate: {
        name: 'test1',
        step: 'test1',
        failureRate: '50%',
      },
      changeFailureRateOfPipelines: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
