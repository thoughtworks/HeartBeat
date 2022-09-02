import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportParams } from './reportParams';

describe('ReportParams', () => {
  it('should create a reportParams instance', () => {
    const reportParams = new ReportParams({
      metrics: ['metricOne', 'metricTwo'],
      startDate: new Date(),
      endDate: new Date(),
      considerHoliday: false,
    });

    expect(reportParams.metrics).toEqual(['metricOne', 'metricTwo']);
  });
});
