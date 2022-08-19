import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ReportParams } from '../../models/reportParams';
import { MetricsSource } from '../../types/metricsSource';

@Component({
  selector: 'app-config-stepper',
  templateUrl: './config-stepper.component.html',
  styleUrls: ['./config-stepper.component.scss'],
})
export class ConfigStepperComponent implements OnInit {
  metricsSource: MetricsSource;
  reportsParams: ReportParams;
  finalParams: ReportParams;
  configFormValue;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onStepOneSubmit({
    metricsSource,
    reportsParams,
    configFormValue,
  }: {
    metricsSource: MetricsSource;
    reportsParams: ReportParams;
    configFormValue: any;
  }) {
    this.metricsSource = metricsSource;
    this.reportsParams = reportsParams;
    this.configFormValue = Object.assign({}, configFormValue);
  }

  onStepTwoSubmit({ deployment, boardColumns, treatFlagCardAsBlock, users, leadTime, targetFields, doneColumn }) {
    if (this.reportsParams.pipeline) {
      this.reportsParams.pipeline.deployment = deployment;
    }
    if (this.reportsParams.kanbanSetting) {
      this.reportsParams.kanbanSetting.boardColumns = boardColumns;
      this.reportsParams.kanbanSetting.treatFlagCardAsBlock = treatFlagCardAsBlock;
      this.reportsParams.kanbanSetting.users = users;
      this.reportsParams.kanbanSetting.targetFields = targetFields;
      this.reportsParams.kanbanSetting.doneColumn = doneColumn;
    }
    if (this.reportsParams.codebaseSetting) {
      this.reportsParams.codebaseSetting.leadTime = leadTime;
    }

    this.finalParams = Object.assign({}, this.reportsParams);
  }

  navigateToHome() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      isConfirm && this.router.navigate(['/dora/home'], { replaceUrl: true });
    });
  }
}
