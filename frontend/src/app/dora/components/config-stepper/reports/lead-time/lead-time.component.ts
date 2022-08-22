import { Component, OnInit, Input } from '@angular/core';
import { LeadTime } from 'src/app/dora/types/reportResponse';
import { PipelineReport } from 'src/app/dora/types/report';
import { leadTimeReport } from 'src/app/dora/utils/config';
import Step from '../../../../models/buildkiteStepParams';

@Component({
  selector: 'app-lead-time-report',
  templateUrl: './lead-time.component.html',
  styleUrls: ['./lead-time.component.scss'],
})
export class LeadTimeReportComponent implements OnInit {
  @Input() leadTime: LeadTime;

  displayedColumns: string[] = ['pipeline', 'name', 'value'];
  dataSource: PipelineReport[] = [];
  count = 2;

  constructor() {}

  ngOnInit(): void {
    const leadTimeReportOfAvg: PipelineReport[] = leadTimeReport.map(({ id, name }) => ({
      pipeline: this.leadTime.avgLeadTimeForChanges.name,
      step: new Step(this.leadTime.avgLeadTimeForChanges.step),
      name,
      value: this.convertTime(this.leadTime.avgLeadTimeForChanges[id]),
    }));

    const leadTimeOfPipelines = this.leadTime.leadTimeForChangesOfPipelines;
    leadTimeOfPipelines.forEach((leadTime) => {
      const leadTimeReportOfPipeline: PipelineReport[] = leadTimeReport.map(({ id, name }) => ({
        pipeline: leadTime.name,
        step: new Step(leadTime.step),
        name,
        value: this.convertTime(leadTime[id]),
      }));
      this.dataSource.push(...leadTimeReportOfPipeline);
    });
    console.log(this.dataSource);
    if (leadTimeOfPipelines.length > 1) this.dataSource.push(...leadTimeReportOfAvg);
  }

  getRowSpan() {
    if (this.count >= 2) {
      this.count = 0;
      return 1;
    }
    this.count++;
    return 0;
  }

  convertTime(minutes: number) {
    if (minutes === 0) {
      return minutes.toString();
    }

    if (minutes < 1 && minutes > 0) {
      return `${minutes} minute`;
    }

    const day = Math.floor(minutes / 60 / 24);
    const hour = Math.floor((minutes / 60) % 24);
    const min = Math.floor(minutes % 60);

    let duration = '';
    if (day > 0) {
      duration = day + (day === 1 ? ' day ' : ' days ');
    }
    if (hour > 0) {
      duration += hour + (hour === 1 ? ' hour ' : ' hours ');
    }
    if (min > 0) {
      duration += min + (min === 1 ? ' minute' : ' minutes');
    }
    console.log(duration);
    return duration;
  }
}
