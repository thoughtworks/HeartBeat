import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockReasonPercentageReportComponent} from './block-reason-percentage.component';

describe('ReportsBlockReasonPercentageComponent', () => {
  let component: BlockReasonPercentageReportComponent;
  let fixture: ComponentFixture<BlockReasonPercentageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockReasonPercentageReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockReasonPercentageReportComponent);
    component = fixture.componentInstance;
    component.latestSprintBlockReason = {
      totalBlockedPercentage: 0.3,
      blockReasonPercentage: [{reasonName: "dependencies_not_work", percentage: 0.2}, {
        reasonName: "sit_env_down",
        percentage: 0.1
      }, {reasonName: "priority_change", percentage: 0.2}, {
        reasonName: "solution_review",
        percentage: 0.2
      }, {reasonName: "pr_review", percentage: 0.2}, {
        reasonName: "question_to_be_answered",
        percentage: 0.2
      }, {reasonName: "take_leave", percentage: 0.2}, {
        reasonName: "others",
        percentage: 0.2
      }],
    };
    fixture.detectChanges();
  });

  it('should create block reason percentage component success', () => {
    expect(component).toBeTruthy();
  });
});
