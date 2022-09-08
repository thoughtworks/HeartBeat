import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportComponent } from './reports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { ApiService } from 'src/app/dora/service/api.service';
import { ReportParams } from '../../../models/reportParams';
import { BoardParams } from 'src/app/dora/models/boardParams';
import { of } from 'rxjs';
import { ReportResponse } from '../../../types/reportResponse';

describe('ExportComponent', () => {
  let exportComponent: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComponent);
    apiService = TestBed.inject(ApiService);
    exportComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(exportComponent).toBeTruthy();
  });

  it('should change includeBoardData and includePipelineData status when call ngOnChanges', () => {
    const kanbanSetting = new BoardParams({
      type: 'jira',
      token: 'test-token',
      site: 'site',
      projectKey: 'ADM',
      boardId: '2',
      teamName: '',
      teamId: '',
      email: '',
    });
    const commonReportParams = new ReportParams({
      metrics: ['Velocity', 'Cycle time'],
      startDate: new Date('2020-11-1'),
      endDate: new Date('2020-11-30'),
      considerHoliday: true,
    });
    const reportParams = {
      kanbanSetting,
      ...commonReportParams,
    };
    exportComponent.csvTimeStamp = 1467302400000;
    exportComponent.params = commonReportParams;

    exportComponent.ngOnChanges({
      params: new SimpleChange(null, reportParams, true),
    });
    fixture.detectChanges();
    expect(exportComponent.includeBoardData).toBeTrue;
    expect(exportComponent.includePipelineData).toBeTrue;
  });

  describe('should fetch report', () => {
    it('should set loading and reportResponse when getting response ', () => {
      const response: ReportResponse = {
        velocity: {
          velocityForSP: '6',
          velocityForCards: '3',
        },
        cycleTime: {
          averageCircleTimePerCard: '3.93',
          averageCycleTimePerSP: '1.97',
          totalTimeForCards: 11.8,
          swimlaneList: [
            {
              optionalItemName: 'To do',
              averageTimeForSP: '0.33',
              averageTimeForCards: '0.65',
              totalTime: '1.95',
            },
            {
              optionalItemName: 'In Dev',
              averageTimeForSP: '1.11',
              averageTimeForCards: '2.23',
              totalTime: '6.68',
            },
            {
              optionalItemName: 'Testing',
              averageTimeForSP: '0.54',
              averageTimeForCards: '1.07',
              totalTime: '3.22',
            },
            {
              optionalItemName: 'Done',
              averageTimeForSP: '4.80',
              averageTimeForCards: '9.60',
              totalTime: '28.80',
            },
            {
              optionalItemName: 'Block',
              averageTimeForSP: '0.32',
              averageTimeForCards: '0.63',
              totalTime: '1.90',
            },
          ],
        },
        changeFailureRate: undefined,
        classification: [],
        completedCardsNumber: [],
        standardDeviation: [],
        blockedAndDevelopingPercentage: [],
        deploymentFrequency: undefined,
        leadTimeForChanges: undefined,
        meanTimeToRecovery: undefined,
        latestSprintBlockReason: {
          totalBlockedPercentage: 0.3,
          blockReasonPercentage: [
            { reasonName: 'dependencies_not_work', percentage: 0.2 },
            {
              reasonName: 'sit_env_down',
              percentage: 0.1,
            },
            { reasonName: 'priority_change', percentage: 0.2 },
            {
              reasonName: 'solution_review',
              percentage: 0.2,
            },
            { reasonName: 'pr_review', percentage: 0.2 },
            {
              reasonName: 'question_to_be_answered',
              percentage: 0.2,
            },
            { reasonName: 'take_leave', percentage: 0.2 },
            {
              reasonName: 'others',
              percentage: 0.2,
            },
          ],
        },
      };
      spyOn(apiService, 'generateReporter').and.returnValue(of(response));
      exportComponent.fetchReports();
      fixture.detectChanges();
      expect(exportComponent.loading).toBeFalse;
      expect(exportComponent.reportResponse).toEqual(response);
    });

    it('should only set loading when response is null', () => {
      spyOn(apiService, 'generateReporter').and.returnValue(of(null));
      exportComponent.fetchReports();
      fixture.detectChanges();
      expect(exportComponent.loading).toBeFalse;
    });
  });
});
