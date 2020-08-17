import { Component, OnInit, Input } from '@angular/core';
import { DeploymentFrequency } from 'src/app/dora/types/reportResponse';
import { PipelineReport } from 'src/app/dora/types/report';
import { deploymentFrequencyReport } from 'src/app/dora/utils/config';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Step from '../../../models/buildkiteStepParams';

@Component({
  selector: 'app-deployment-frequency-report',
  templateUrl: './deployment-frequency.component.html',
  styleUrls: ['./deployment-frequency.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeploymentFrequencyReportComponent implements OnInit {
  @Input() deploymentFrequency: DeploymentFrequency;

  displayedColumns: string[] = ['pipeline', 'name', 'value'];
  displayedDetailedColumns: string[] = ['date', 'count'];
  dataSource: PipelineReport[] = [];
  expandedElement: PipelineReport = null;
  constructor() {}

  ngOnInit(): void {
    const deploymentFrequencyOfAvg: PipelineReport[] = deploymentFrequencyReport.map(({ id, name }) => ({
      pipeline: this.deploymentFrequency.avgDeploymentFrequency.name,
      step: new Step(this.deploymentFrequency.avgDeploymentFrequency.step),
      name,
      value: this.deploymentFrequency.avgDeploymentFrequency[id],
      items: [],
    }));

    const deploymentFrequencyOfPipelines = this.deploymentFrequency.deploymentFrequencyOfPipelines;
    deploymentFrequencyOfPipelines.forEach((deploymentFrequency) => {
      const pipelineReports: PipelineReport[] = deploymentFrequencyReport.map(({ id, name }) => ({
        pipeline: deploymentFrequency.name,
        step: new Step(deploymentFrequency.step),
        name,
        value: deploymentFrequency[id],
        items: deploymentFrequency.items,
      }));
      this.dataSource.push(...pipelineReports);
    });
    if (deploymentFrequencyOfPipelines.length > 1) this.dataSource.push(...deploymentFrequencyOfAvg);
  }
}
