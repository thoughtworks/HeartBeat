import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import * as Config from '../../utils/config';
import { Metric } from '../../types/metric';
import { MetricsConfig } from '../../types/metrics-config';
import { MetricsSource } from '../../types/metricsSource';
import { TokenVerifyService } from '../../service/token-verify.service';
import GitUrlParse from 'git-url-parse';
import { PipelineParams } from '../../models/pipelineParams';
import { BoardParams } from '../../models/boardParams';
import { CodebaseParams } from '../../models/codebaseParams';
import { ReportParams } from '../../models/reportParams';
import { DoraErrorStateMatcher } from '../../utils/doraErrorStateMatcher';
import { UtilsService } from '../../service/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StepsFetchService } from '../../service/steps-fetch.service';
import { CycleDoneService } from '../../service/cycle-done.service';
import { controlNames, metricsConstant } from '../../utils/constant';

const sourceControlMetricKey = 'sourceControl';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, AfterContentChecked {
  @Output() stepOneSubmit = new EventEmitter();

  importData: any;
  metricsConfig: MetricsConfig = Config.metricsConfig;
  metrics: Metric[] = Config.metrics;

  metricsSource: MetricsSource = {};
  filterMetricsConfig: MetricsConfig = {};
  matcher = new DoraErrorStateMatcher();
  sourceControl: { type: string; data: Array<string> };
  doneColumnsControlName = controlNames.doneStatus;
  doneKeyFromBackend = metricsConstant.doneKeyFromBackend;

  configForm = this.formBuilder.group(
    {
      projectName: ['', Validators.required],
      metrics: ['', Validators.required],
    },
    {
      validators: this.tokenVerifyService.verifyTokenValidator(),
    }
  );

  get selectedMetrics(): Metric[] {
    return this.configForm.get('metrics').value.map((name) => this.metrics.find((metric) => metric.name === name));
  }

  get selectedMetricRoles() {
    return new Set(this.selectedMetrics.flatMap((metric) => metric.roles));
  }

  constructor(
    private formBuilder: FormBuilder,
    private tokenVerifyService: TokenVerifyService,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private stepsFetchService: StepsFetchService,
    private cycleDoneService: CycleDoneService
  ) {}

  ngOnInit(): void {
    this.importMetrics();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  importMetrics() {
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe((result) => {
      if (!result || !result.data) {
        return;
      }
      this.importData = JSON.parse(result.data);
      this.configForm.patchValue({
        metrics: this.importData.metrics || [],
        projectName: this.importData.projectName || '',
      });
      this.selectedMetricRoles.forEach((formGroupName) => {
        this.filterMetricsConfig[formGroupName] = this.metricsConfig[formGroupName];
      });
    });
  }

  selectionChange({ value: metrics }) {
    this.filterMetricsConfig = {};
    this.selectedMetricRoles.forEach((formGroupName) => {
      this.filterMetricsConfig[formGroupName] = this.metricsConfig[formGroupName];
    });
    if (!this.selectedMetricRoles.has(sourceControlMetricKey)) {
      this.sourceControl = null;
    }
  }

  onVerify({ formGroupName, value }) {
    if (formGroupName === sourceControlMetricKey) {
      this.sourceControl = value;
      return;
    }
    this.metricsSource[formGroupName] = value;
  }

  getRequestParams(formValue): ReportParams {
    const reportRequestParams = new ReportParams(formValue);

    if (formValue.pipelineTool) {
      reportRequestParams.pipeline = new PipelineParams(formValue.pipelineTool);
    }
    if (formValue.sourceControl) {
      reportRequestParams.codebaseSetting = new CodebaseParams(formValue.sourceControl);
    }
    if (formValue.board) {
      reportRequestParams.kanbanSetting = new BoardParams(formValue.board);
    }

    return reportRequestParams;
  }

  getMetricsSource() {
    Object.keys(this.metricsSource).forEach((key) => {
      if (![...this.selectedMetricRoles].includes(key)) {
        delete this.metricsSource[key];
      }
    });

    if (this.sourceControl) {
      const pipelines = this.filterMetricSourceForSourceControl(this.sourceControl.data, this.metricsSource);
      this.metricsSource.sourceControl = {
        type: this.sourceControl.type,
        data: pipelines,
      };
      this.sourceControl = null;
    }

    return this.metricsSource;
  }

  filterMetricSourceForSourceControl(sourceControlRepos: Array<string>, metricsSource: MetricsSource) {
    const repos = sourceControlRepos.map((repo) => {
      const urlParse = GitUrlParse(repo);
      return `${urlParse.source}/${urlParse.full_name}`;
    });
    const pipelines = metricsSource.pipelineTool.data.filter((pipeline) => {
      const urlParse = GitUrlParse(pipeline.repository);
      const url = `${urlParse.source}/${urlParse.full_name}`;
      return repos.includes(url);
    });

    return pipelines;
  }

  onSubmit() {
    const metricsSource = this.getMetricsSource();
    const reportsParams = this.getRequestParams(this.configForm.value);
    this.saveDataForNextPage(metricsSource, reportsParams);
    this.stepOneSubmit.emit({ metricsSource, reportsParams, configFormValue: this.configForm.value });
  }

  saveDataForNextPage(metricsSource: MetricsSource, reportsParams: ReportParams) {
    if (reportsParams.pipeline) {
      const {
        pipeline: { token, type },
        startTime,
        endTime,
      } = reportsParams;
      this.stepsFetchService.setValue({ token, type, startTime, endTime });
    }
    if (metricsSource && metricsSource.board && metricsSource.board.data.jiraColumns) {
      const jiraColumnsData = this.metricsSource.board.data.jiraColumns;
      const importDoneStatus = this.importData && this.importData[this.doneColumnsControlName];
      let doneStatusArr = [];
      if (importDoneStatus && importDoneStatus.length > 0) {
        doneStatusArr = importDoneStatus
          .map((item) => jiraColumnsData.find((i) => i.value.statuses.includes(item)))
          .flatMap((item) => item && item.value.statuses);
      } else {
        doneStatusArr = jiraColumnsData
          .filter((item) => item.key === this.doneKeyFromBackend)
          .flatMap((item) => item && item.value.statuses);
      }
      this.cycleDoneService.setValue([...new Set(doneStatusArr)]);
    }
  }

  trackByItems(index: number, config: { key; value }): number {
    return config.key;
  }

  saveConfig() {
    this.utils.exportToJsonFile({ fileName: 'config.json', json: this.configForm.value });
  }

  backToHome() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      isConfirm && this.router.navigate(['/dora/home'], { replaceUrl: true });
    });
  }
}
