import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Step from '../../../../../models/buildkiteStepParams';
import { ApiService } from '../../../../../service/api.service';
import { StepsFetchService } from '../../../../../service/steps-fetch.service';
import { PipelineControl } from '../../../../../types/import-config';
import { Org, Pipeline, PipelineEqual } from '../../../../../types/pipeline';
import { DoraErrorStateMatcher } from '../../../../../utils/doraErrorStateMatcher';

@Component({
  selector: 'app-pipeline-item',
  templateUrl: './pipeline-item.component.html',
  styleUrls: ['./pipeline-item.component.scss'],
})
export class PipelineItemComponent implements OnInit, OnChanges {
  @Input() rawData: Pipeline[];
  @Input() metricsForm: FormGroup;
  @Input() groupName: string;
  @Input() hasOrg: boolean;
  @Input() formArrayName: string;
  @Input() equalItems: PipelineEqual[];
  @Input() importPipeline: PipelineControl;

  @Output() removePipeline = new EventEmitter();

  allOrg: Org[] = [];
  selectedOrgId: string;
  filterPipelines: Pipeline[] = [];
  selectedPipelineId: string;
  filterSteps: Step[] = [];
  selectedStep = '';
  isDuplicated = false;
  matcher = new DoraErrorStateMatcher();
  loading = false;
  // To flag which error to display for steps
  isEmptyStepsAfterFetch = false;

  warningMessagesForImport: string[] = [];

  get pipelineForm() {
    return this.metricsForm.get(this.formArrayName) as FormArray;
  }

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private stepsFetchService: StepsFetchService
  ) {}

  ngOnInit(): void {
    if (this.hasOrg) {
      this.allOrg = this.getOrgArrays();
    } else {
      this.filterPipelines = this.rawData;
    }
    this.importPipeline && this.handleImport();
  }

  handleImport() {
    if (this.importPipeline.orgId && this.hasOrg) {
      if (!this.allOrg.find((org) => org.orgId === this.importPipeline.orgId)) {
        this.addWarningMessage('This organization in import data might be removed now.');
        return;
      }
      this.filterPipelines = this.rawData.filter((pipeline) => pipeline.orgId === this.importPipeline.orgId);
    }

    if (!this.importPipeline.pipelineId) {
      return;
    }

    if (!!this.filterPipelines.find((pipeline) => pipeline.id === this.importPipeline.pipelineId)) {
      this.onPipelineChange(this.importPipeline.pipelineId, true);
    } else {
      this.addWarningMessage('This Pipeline in import data might be removed now.');
      this.updatePipelineValidate({
        pipeline: '',
        step: '',
      });
    }
  }

  ngOnChanges({ equalItems }: SimpleChanges): void {
    this.updateIsDuplicated();
  }

  updateIsDuplicated() {
    this.isDuplicated = !!this.equalItems.find(
      (item) =>
        this.selectedPipelineId &&
        this.selectedStep &&
        item.id === this.selectedPipelineId &&
        item.step === this.selectedStep
    );
  }

  getOrgArrays() {
    return this.rawData
      .map(({ orgId, orgName }) => ({ orgId, orgName }))
      .reduce((prev, current) => {
        if (!prev.find((p) => p.orgId === current.orgId)) {
          prev.push(current);
        }
        return prev;
      }, []);
  }

  onOrgChange(orgId: string) {
    this.isEmptyStepsAfterFetch = false;
    this.filterPipelines = this.rawData.filter((item) => orgId === item.orgId);
    this.filterSteps = [];
    this.updatePipelineValidate({
      pipeline: '',
      step: '',
    });
  }

  onPipelineChange(pipelineId: string, isInit: boolean) {
    this.selectedPipelineId = pipelineId;
    this.loading = true;
    this.isEmptyStepsAfterFetch = false;
    !isInit &&
      this.updatePipelineValidate({
        step: '',
      });
    const pipeline = this.rawData.find((pipelineItem) => pipelineItem.id === pipelineId);
    pipeline &&
      this.stepsFetchService.getVaule().subscribe((extraParams) => {
        this.fetchSteps(pipeline, extraParams);
      });
  }

  fetchSteps(pipeline: Pipeline, extraParams) {
    const { id, name, repository, orgId, orgName } = pipeline;
    const { token, type, startTime, endTime } = extraParams;
    this.apiService
      .fetchStepsByPipeline({
        pipelineId: id,
        pipelineName: name,
        repository,
        orgId,
        orgName,
        token,
        type,
        startTime,
        endTime,
      })
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.filterSteps = [];
          response.steps.forEach((step: string) => {
            this.filterSteps.push(new Step(step));
          });
          this.isEmptyStepsAfterFetch = this.filterSteps.length === 0;
          if (
            this.importPipeline &&
            this.importPipeline.step &&
            this.importPipeline.pipelineId === this.selectedPipelineId
          ) {
            if (!this.filterSteps.some((step) => step.originStep === this.importPipeline.step)) {
              this.addWarningMessage('Selected step of this pipeline in import data might be removed.');
              this.updatePipelineValidate({
                step: '',
              });
            } else {
              this.selectedStep = this.importPipeline.step;
            }
          }
        },
        () => {
          this.loading = false;
          this.openMessage('Get the steps of this pipline failed');
        }
      );
  }

  onStepChange(step: string) {
    this.selectedStep = step;
  }

  // update form validator value
  updatePipelineValidate(patchData: any) {
    const itemControl = this.pipelineForm.controls[this.groupName];
    if (!!itemControl) {
      itemControl.patchValue(patchData);
    }
  }

  openMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  }

  addWarningMessage(message: string) {
    this.warningMessagesForImport.push(message);
  }
}
