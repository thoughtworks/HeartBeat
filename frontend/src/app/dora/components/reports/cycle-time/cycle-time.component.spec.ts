import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTimeReportComponent } from './cycle-time.component';

describe('ReportsCycleTimeComponent', () => {
  let component: CycleTimeReportComponent;
  let fixture: ComponentFixture<CycleTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CycleTimeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleTimeReportComponent);
    component = fixture.componentInstance;
    component.cycleTime = {
      totalTimeForCards: 5,
      averageCircleTimePerCard: '2',
      averageCycleTimePerSP: '3',
      swimlaneList: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
