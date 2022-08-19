import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTimeReportComponent } from './lead-time.component';

describe('LeadTimeComponent', () => {
  let component: LeadTimeReportComponent;
  let fixture: ComponentFixture<LeadTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadTimeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTimeReportComponent);
    component = fixture.componentInstance;
    component.leadTime = {
      leadTimeForChangesOfPipelines: [
        {
          name: 'string2',
          step: 'string2',
          mergeDelayTime: 2,
          pipelineDelayTime: 2,
          totalDelayTime: 2,
        },
      ],
      avgLeadTimeForChanges: {
        name: 'string',
        step: 'string',
        mergeDelayTime: 1,
        pipelineDelayTime: 1,
        totalDelayTime: 1,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
