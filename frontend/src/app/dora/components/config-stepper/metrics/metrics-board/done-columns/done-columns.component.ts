import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CycleDoneService } from '../../../../../service/cycle-done.service';
import { JiraColumn } from '../../../../../types/board';
import { controlNames } from '../../../../../utils/constant';
import { DoraErrorStateMatcher } from '../../../../../utils/doraErrorStateMatcher';

@Component({
  selector: 'app-done-columns',
  templateUrl: './done-columns.component.html',
  styleUrls: ['./done-columns.component.scss'],
})
export class DoneColumnsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metricsForm: FormGroup;
  @Input() cycleTimeData: JiraColumn[];
  @Input() importDoneStatus: string[];

  doneColumnsControlName = controlNames.doneStatus;
  matcher = new DoraErrorStateMatcher();
  doneColumns: string[];
  warningMessagesForImport: string[] = [];

  constructor(private cycleDoneService: CycleDoneService) {}

  ngOnInit(): void {
    this.getDoneColumns(true);
  }

  ngOnChanges({ cycleTimeData }: SimpleChanges): void {
    if (cycleTimeData && !cycleTimeData.firstChange) {
      this.metricsForm.controls[this.doneColumnsControlName].reset();
      this.getDoneColumns(false);
    }
  }

  ngOnDestroy(): void {
    this.metricsForm.removeControl(this.doneColumnsControlName);
  }

  initControl(doneList: string[]) {
    let importValue = [];
    if (this.importDoneStatus && this.importDoneStatus.length > 0) {
      const includesDoneStatus = this.importDoneStatus.filter((doneStatus) => doneList.includes(doneStatus));
      importValue = includesDoneStatus.length > 0 ? includesDoneStatus : [];
      if (includesDoneStatus.length !== this.importDoneStatus.length) {
        this.addWarningMessage('Some selected doneStatus in import data might be removed now.');
      }
    }
    this.metricsForm.addControl(
      this.doneColumnsControlName,
      new FormControl(importValue.length > 0 ? importValue : '', Validators.required)
    );
  }

  getDoneColumns(isInit: boolean) {
    this.cycleDoneService.getValue().subscribe((doneList) => {
      if (isInit) {
        this.initControl(doneList);
      }
      this.doneColumns = doneList;
      if (doneList.length <= 1) {
        this.metricsForm.controls[this.doneColumnsControlName] &&
          this.metricsForm.controls[this.doneColumnsControlName].patchValue(doneList);
      }
    });
  }

  addWarningMessage(message: string) {
    this.warningMessagesForImport.push(message);
  }
}
