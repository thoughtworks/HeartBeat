import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Pipeline, PipelineEqual } from '../../types/pipeline';
import { PipelineControl } from '../../types/import-config';
import { FormGroup, Validators, FormBuilder, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-metric-pipeline',
  templateUrl: './metric-pipeline.component.html',
  styleUrls: ['./metric-pipeline.component.scss'],
})
export class MetricPipelineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pipelines: Pipeline[];
  @Input() metricsForm: FormGroup;
  @Input() formArrayName: string;
  @Input() importPipelines: PipelineControl[];

  hasOrg = false;
  equalItems: PipelineEqual[];

  get pipelineForm() {
    return this.metricsForm.get(this.formArrayName) as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges({ pipelines }: SimpleChanges): void {
    if (pipelines && !pipelines.firstChange) {
      this.pipelineForm.clear();
      this.initPipeline();
    }
  }

  ngOnInit(): void {
    this.initPipeline();
  }

  initFormControl() {
    this.metricsForm.addControl(
      this.formArrayName,
      this.formBuilder.array([], {
        validators: this.validatorFn(),
      })
    );
  }

  initPipeline() {
    this.initFormControl();
    this.hasOrg = Boolean(this.pipelines.find((pipeline) => pipeline.orgId && pipeline.orgName));
    if (this.importPipelines) {
      this.importPipelines.forEach((pipeline) => {
        this.addPipeline(pipeline);
      });
    } else {
      this.addPipeline(null);
    }
  }

  addPipeline(pipeline) {
    const itemFormGroup = Object.assign(
      {
        pipelineId: [(pipeline && pipeline.pipelineId) || '', Validators.required],
        step: [(pipeline && pipeline.step) || '', Validators.required],
      },
      this.hasOrg ? { orgId: [(pipeline && pipeline.orgId) || '', Validators.required] } : {}
    );
    this.pipelineForm.push(this.formBuilder.group(itemFormGroup));
  }

  removePipeline(index) {
    // TODO: Not sure if any issues will be caused when only remove by index
    this.pipelineForm.removeAt(index);
  }

  ngOnDestroy(): void {
    this.pipelineForm.clear();
  }

  validatorFn(): ValidatorFn {
    return (group: FormArray): ValidationErrors | null => {
      const isDuplicated = this.validateArray(group.value);
      return !isDuplicated ? null : { formValid: false };
    };
  }

  validateArray(array: PipelineControl[]) {
    this.equalItems = [];
    this.getDuplicated(Array.from(array));
    return this.equalItems.length > 0;
  }

  getDuplicated(array: PipelineControl[]) {
    if (array.length === 0) {
      return;
    }
    const firstEle = array.shift();
    if (firstEle.pipelineId && firstEle.step) {
      const findEqual = array.filter((item) => firstEle.step === item.step && firstEle.pipelineId === item.pipelineId);

      const findNotEqual = array.filter(
        (item) =>
          item.step && item.pipelineId && (firstEle.step !== item.step || firstEle.pipelineId !== item.pipelineId)
      );

      if (findEqual.length > 0) {
        this.equalItems.push({ id: firstEle.pipelineId, step: firstEle.step });
      }
      array = findNotEqual;
    }
    this.getDuplicated(array);
  }
}
