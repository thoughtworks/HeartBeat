import { Component, OnInit, Input } from '@angular/core';
import { MeanTimeToRecovery } from 'src/app/dora/types/reportResponse';
import { PipelineReport } from 'src/app/dora/types/report';
import { meanTimeToRecoveryReport } from 'src/app/dora/utils/config';
import Step from '../../../models/buildkiteStepParams';

@Component({
  selector: 'app-mean-time-to-recovery-report',
  templateUrl: './mean-time-to-recovery.component.html',
  styleUrls: ['./mean-time-to-recovery.component.scss'],
})
export class MeanTimeToRecoveryComponent implements OnInit {
  @Input() meanTimeToRecovery: MeanTimeToRecovery;

  displayedColumns: string[] = ['pipeline', 'name', 'value'];
  dataSource: PipelineReport[] = [];
  constructor() {}

  ngOnInit(): void {
    const meanTimeToRecoveryOfAvg: PipelineReport[] = meanTimeToRecoveryReport.map(({ id, name }) => ({
      pipeline: this.meanTimeToRecovery.avgMeanTimeToRecovery.name,
      step: new Step(this.meanTimeToRecovery.avgMeanTimeToRecovery.step),
      name,
      value: timeToHour(this.meanTimeToRecovery.avgMeanTimeToRecovery[id]),
    }));

    const meanTimeToRecoveryOfPipelines = this.meanTimeToRecovery.meanTimeRecoveryPipelines;
    meanTimeToRecoveryOfPipelines.forEach((meanTimeToRecoveryPipeline) => {
      const pipelineReports: PipelineReport[] = meanTimeToRecoveryReport.map(({ id, name }) => ({
        pipeline: meanTimeToRecoveryPipeline.name,
        step: new Step(meanTimeToRecoveryPipeline.step),
        name,
        value: timeToHour(meanTimeToRecoveryPipeline[id]),
      }));
      this.dataSource.push(...pipelineReports);
    });

    if (meanTimeToRecoveryOfPipelines.length > 1) this.dataSource.push(...meanTimeToRecoveryOfAvg);
  }
}

function timeToHour(time: number): string {
  return `${Math.ceil(time / 3600000)}h${Math.ceil((time % 3600000) / 60000)}min`;
}
