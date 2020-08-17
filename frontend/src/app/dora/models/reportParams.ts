import { CodebaseParams } from '../types/reportRequestParams';
import { PipelineParams } from '../models/pipelineParams';
import { BoardParams } from '../models/boardParams';

export class ReportParams {
  metrics: string[];
  pipeline?: PipelineParams;
  kanbanSetting?: BoardParams;
  codebaseSetting?: CodebaseParams;
  considerHoliday: boolean;
  startTime: number;
  endTime: number;

  constructor({
    metrics,
    startDate,
    endDate,
    considerHoliday,
  }: {
    metrics: string[];
    startDate: Date;
    endDate: Date;
    considerHoliday: boolean;
  }) {
    this.metrics = metrics;
    this.startTime = this.convertToTimestamp(startDate, '00:00:00');
    this.endTime = this.convertToTimestamp(endDate, '23:59:59');
    this.considerHoliday = considerHoliday;
  }

  convertToTimestamp(date: Date, time: string): number {
    const dateString = new Date(date).toLocaleDateString('en-US');
    return new Date(`${dateString} ${time}`).getTime();
  }
}
