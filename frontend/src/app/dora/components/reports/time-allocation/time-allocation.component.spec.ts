import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimeAllocationReportComponent} from './time-allocation.component';

describe('ReportsTimeAllocationPercentageComponent', () => {
  let component: TimeAllocationReportComponent;
  let fixture: ComponentFixture<TimeAllocationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeAllocationReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAllocationReportComponent);
    component = fixture.componentInstance;
    component.blockedAndDevelopingPercentage = [{
      sprintName: 'ADM Sprint1', value: {
        blockedPercentage: 0.1,
        developingPercentage: 0.9,
      }
    }, {
      sprintName: 'ADM Sprint2', value: {
        blockedPercentage: 0.3,
        developingPercentage: 0.7,
      }
    }, {
      sprintName: 'ADM Sprint1', value: {
        blockedPercentage: 0.2,
        developingPercentage: 0.8,
      }
    }];
    fixture.detectChanges();
  });

  it('should create block reason percentage component success', () => {
    expect(component).toBeTruthy();
  });
})
;
