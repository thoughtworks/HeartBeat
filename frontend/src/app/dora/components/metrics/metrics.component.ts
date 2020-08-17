import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MetricsSource } from '../../types/metricsSource';
import { metricsConstant, controlNames } from '../../utils/constant';
import { metricFormConfig } from '../../utils/config';
import { UtilsService } from '../../service/utils.service';
import { ImportConfigService } from '../../service/import-config.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, AfterContentChecked, OnChanges {
  @Input() metricsSource: MetricsSource;
  @Input() metricsParams: string[];
  @Input() configFormValue: any;
  @Output() stepTwoSubmit = new EventEmitter();

  leadTimeControlName = controlNames.leadTime;
  doneStatusControlName = controlNames.doneStatus;
  cycleTimeControlName = controlNames.cycleTime;
  crewsControlName = controlNames.crews;
  jiraColumnsControlName = controlNames.jiraColumns;
  treatFlagCardAsBlockControlName = controlNames.treatFlagCardAsBlock;
  classificationsControlName = controlNames.classifications;
  deploymentControlName = controlNames.deployment;

  displayItems: string[];

  importConfig = null;

  metricsForm = this.formBuilder.group({});

  get pipeline() {
    return this.metricsForm.get(this.deploymentControlName) as FormArray;
  }

  get leadTime() {
    return this.metricsForm.get(this.leadTimeControlName) as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private utils: UtilsService,
    private importConfigService: ImportConfigService
  ) {}

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  formatJiraColumns(columns) {
    return columns
      .map((item) => {
        const returnItem = {
          name: Object.keys(item)[0],
          value: Object.values(item)[0],
        };
        return returnItem;
      })
      .filter((item) => item.value !== metricsConstant.cycleTimeEmptyStr);
  }

  formatCrews(crews: string[]) {
    const isAllChecked = crews.includes(metricsConstant.crewAll);
    if (!isAllChecked) {
      return crews;
    }
    const index = crews.findIndex((item) => item === metricsConstant.crewAll);
    crews.splice(index, 1);
    return crews;
  }

  formatClassifications(classifications: string[]) {
    const isAllChecked = classifications.includes(metricsConstant.crewAll);
    const originalList = this.metricsSource.board.data.targetFields;
    if (!classifications) {
      return originalList;
    }
    if (isAllChecked) {
      originalList.map((item) => (item.flag = true));
    } else {
      originalList.forEach((item) => {
        item.flag = !!classifications.find((classification) => {
          return classification === item.key;
        });
      });
    }
    return originalList;
  }

  formatDoneColumns() {
    if (this.metricsSource.board && this.metricsSource.board.data.jiraColumns) {
      const doneColumn = this.metricsSource.board.data.jiraColumns.find(
        (item) => item.key === metricsConstant.doneKeyFromBackend
      );
      return doneColumn ? doneColumn.value.statuses : [];
    }
    return [];
  }

  formatPipeline(selectedPipelines) {
    return selectedPipelines.map(({ pipelineId, step }) => {
      const pipeline = this.metricsSource.pipelineTool.data.find((pipelineItem) => pipelineItem.id === pipelineId);
      return {
        orgId: pipeline.orgId,
        orgName: pipeline.orgName,
        id: pipeline.id,
        name: pipeline.name,
        step,
        repository: pipeline.repository,
      };
    });
  }

  onSubmit() {
    const deployment = this.metricsForm.value[this.deploymentControlName]
      ? this.formatPipeline(this.metricsForm.value[this.deploymentControlName])
      : [];
    const leadTime = this.metricsForm.value[this.leadTimeControlName]
      ? this.formatPipeline(this.metricsForm.value[this.leadTimeControlName])
      : [];

    const boardColumns = this.metricsForm.value[this.cycleTimeControlName]
      ? this.formatJiraColumns(this.metricsForm.value[this.cycleTimeControlName][this.jiraColumnsControlName])
      : [];
    const treatFlagCardAsBlock = this.metricsForm.value[this.cycleTimeControlName]
      ? this.metricsForm.value[this.cycleTimeControlName][this.treatFlagCardAsBlockControlName]
      : false;
    const doneColumn = this.metricsForm.value[this.doneStatusControlName] || this.formatDoneColumns();

    const users = this.metricsForm.value[this.crewsControlName]
      ? this.formatCrews(this.metricsForm.value[this.crewsControlName])
      : [];
    const targetFields = this.metricsForm.value[this.classificationsControlName]
      ? this.formatClassifications(this.metricsForm.value[this.classificationsControlName])
      : this.metricsSource.board?.data.targetFields;
    this.stepTwoSubmit.emit({
      deployment,
      boardColumns,
      treatFlagCardAsBlock,
      users,
      leadTime,
      targetFields,
      doneColumn,
    });
  }

  ngOnInit(): void {
    this.displayItems = this.displayList();
  }

  displayList() {
    if (!this.metricsParams) {
      return [];
    }
    const array = this.metricsParams
      .map((metricName) => metricFormConfig.find((config) => config.name === metricName))
      .flatMap((config) => config.displayItems);
    return [...new Set(array)];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const metricsParamsChanges = changes.metricsParams;
    if (
      metricsParamsChanges &&
      metricsParamsChanges.currentValue &&
      metricsParamsChanges.currentValue !== metricsParamsChanges.previousValue
    ) {
      this.displayItems = this.displayList();
    }
    this.initImportConfig();
  }

  initImportConfig() {
    if (this.importConfigService && this.importConfigService.get()) {
      this.importConfig = Object.assign({}, this.importConfigService.get());
    }
  }

  saveConfig() {
    this.utils.exportToJsonFile({
      fileName: 'config.json',
      json: { ...this.configFormValue, ...this.metricsForm.value },
    });
  }
}
