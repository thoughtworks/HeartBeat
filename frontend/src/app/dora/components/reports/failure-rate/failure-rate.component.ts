import { Component, OnInit, Input } from '@angular/core';
import { FailureRate } from 'src/app/dora/types/reportResponse';
import { PipelineReport } from 'src/app/dora/types/report';
import { failureRateReport } from 'src/app/dora/utils/config';
import Step from '../../../models/buildkiteStepParams';

@Component({
  selector: 'app-failure-rate-report',
  templateUrl: './failure-rate.component.html',
  styleUrls: ['./failure-rate.component.scss'],
})
export class FailureRateReportComponent implements OnInit {
  @Input() failureRate: FailureRate;

  displayedColumns: string[] = ['pipeline', 'name', 'value'];
  dataSource: PipelineReport[] = [];
  constructor() {}

  ngOnInit(): void {
    const changeFailureOfAvg: PipelineReport[] = failureRateReport.map(({ id, name }) => ({
      pipeline: this.failureRate.avgChangeFailureRate.name,
      step: new Step(this.failureRate.avgChangeFailureRate.step),
      name,
      value: this.failureRate.avgChangeFailureRate[id],
    }));

    const failureRateOfPipelines = this.failureRate.changeFailureRateOfPipelines;
    failureRateOfPipelines.forEach((failureRateOfPipeline) => {
      const pipelineReports: PipelineReport[] = failureRateReport.map(({ id, name }) => ({
        pipeline: failureRateOfPipeline.name,
        step: new Step(failureRateOfPipeline.step),
        name,
        value: failureRateOfPipeline[id],
      }));
      this.dataSource.push(...pipelineReports);
    });

    if (failureRateOfPipelines.length > 1) this.dataSource.push(...changeFailureOfAvg);
  }
}
