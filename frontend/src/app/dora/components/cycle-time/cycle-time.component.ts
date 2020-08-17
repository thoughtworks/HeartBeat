import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { JiraColumn } from '../../types/board';
import { metricsConstant, controlNames, cycleTimeList } from '../../utils/constant';
import { CycleDoneService } from '../../service/cycle-done.service';

@Component({
  selector: 'app-cycle-time',
  templateUrl: './cycle-time.component.html',
  styleUrls: ['./cycle-time.component.scss'],
})
export class CycleTimeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metricsForm: FormGroup;
  @Input() cycleTimeData: JiraColumn[];
  @Input() importCycleTime: any;

  cycleTimeGroupName = controlNames.cycleTime;
  doneValue = metricsConstant.doneValue;
  doneKeyFromBackend = metricsConstant.doneKeyFromBackend;
  jiraColumnsControlName = controlNames.jiraColumns;
  treatFlagCardAsBlockControlName = controlNames.treatFlagCardAsBlock;

  treatFlagCardAsBlock: boolean;
  formGroup: FormGroup;
  doneList: JiraColumn[];
  isValid = false;
  warningMessagesForImport: string[] = [];

  constructor(private formBuilder: FormBuilder, private cycleDoneService: CycleDoneService) {}

  get jiraColumnsForm() {
    return this.metricsForm.controls[this.cycleTimeGroupName].get(this.jiraColumnsControlName) as FormArray;
  }

  ngOnInit(): void {
    this.initFormControl();
  }

  ngOnChanges({ cycleTimeData }: SimpleChanges): void {
    if (cycleTimeData && !cycleTimeData.firstChange) {
      this.metricsForm.removeControl(this.cycleTimeGroupName);
      this.initFormControl();
    }
  }

  initFormControl() {
    this.formGroup = Object.assign({
      [this.jiraColumnsControlName]: this.formBuilder.array(this.initJiraColumnControl(), this.validatorFn()),
      [this.treatFlagCardAsBlockControlName]: new FormControl(
        this.importCycleTime ? this.importCycleTime[this.treatFlagCardAsBlockControlName] : true
      ),
    });
    this.metricsForm.addControl(this.cycleTimeGroupName, this.formBuilder.group(this.formGroup));
  }

  initJiraColumnControl() {
    const jiraColumnsFormArray = [];
    const importJiraColumn = (this.importCycleTime && this.importCycleTime[this.jiraColumnsControlName]) || [];
    Object.keys(this.cycleTimeData).map((item) => {
      const cycleTimeItem = this.cycleTimeData[item].value;
      if (!cycleTimeItem || !cycleTimeItem.name) {
        return;
      }
      const controlName = cycleTimeItem.name;
      const importValue = importJiraColumn.find((i) => Object.keys(i)[0] === controlName);
      let defaultValue = metricsConstant.cycleTimeEmptyStr;
      if (importValue && importValue[controlName]) {
        if (cycleTimeList.includes(importValue[controlName])) {
          defaultValue = importValue[controlName];
        } else {
          defaultValue = '';
          this.addWarningMessage(
            `The value of '${controlName}' in import json is not in dropdown list now. Please select a value for it!`
          );
        }
      } else if (importJiraColumn.length > 0) {
        defaultValue = '';
        this.addWarningMessage(`The column of '${controlName}' is a new column. Please select a value for it!`);
      }

      jiraColumnsFormArray.push(
        this.formBuilder.group({
          [controlName]: [defaultValue, Validators.required],
        })
      );
    });

    Object.values(importJiraColumn).map((item) => {
      const controlName = Object.keys(item)[0];
      if (!this.cycleTimeData.find((i) => i.value.name === controlName)) {
        this.addWarningMessage(
          `The column of '${controlName}' is a deleted column, which means this column existed the time you saved config, but was deleted. Please confirm!`
        );
      }
    });
    return jiraColumnsFormArray;
  }

  toogleFlagCardAsBlock() {
    this.treatFlagCardAsBlock = !this.treatFlagCardAsBlock;
  }

  validatorFn(): ValidatorFn {
    return (group: FormArray): ValidationErrors | null => {
      const selectedDones = group.value.filter((item) => Object.values(item)[0] === this.doneValue);
      this.isValid = selectedDones.length <= 1;
      return this.isValid ? null : { formValid: false };
    };
  }

  ngOnDestroy(): void {
    this.metricsForm.removeControl(this.cycleTimeGroupName);
  }

  onSelectionChange() {
    const doneSelected = this.jiraColumnsForm.value.filter((item) => Object.values(item)[0] === this.doneValue);
    let doneRelatedStatuses = [];
    if (doneSelected.length >= 1) {
      const doneRelatedNames = doneSelected.map((item) => Object.keys(item)[0]);
      doneRelatedStatuses = doneRelatedNames
        .map((item) => this.cycleTimeData.find((i) => i.value.name === item))
        .flatMap((item) => item.value.statuses);
    } else {
      const doneColumns = this.cycleTimeData.filter((item) => item.key === this.doneKeyFromBackend);
      doneRelatedStatuses = doneColumns.flatMap((item) => item.value.statuses);
    }
    this.cycleDoneService.setValue([...new Set(doneRelatedStatuses)]);
  }

  addWarningMessage(message: string) {
    this.warningMessagesForImport.push(message);
  }
}
