import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from '../../../../../shared/components/message-dialog/message-dialog.component';
import { ApiService } from '../../../../service/api.service';
import { UtilsService } from '../../../../service/utils.service';
import { Board } from '../../../../types/board';
import { ConfigGroup } from '../../../../types/metrics-config';
import { Pipeline } from '../../../../types/pipeline';
import { exceptionCode } from '../../../../utils/constant';
import { DoraErrorStateMatcher } from '../../../../utils/doraErrorStateMatcher';

@Component({
  selector: 'app-metric-source',
  templateUrl: './metric-source.component.html',
  styleUrls: ['./metric-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MetricSourceComponent implements OnInit, OnDestroy {
  @Input() configForm: FormGroup;
  @Input() importData: any;
  @Input() groupName: string;
  @Input() sources: ConfigGroup;
  @Output() verify = new EventEmitter<{
    formGroupName: string;
    value: { type: string; data: Pipeline[] | Board };
  }>();

  selected: string;
  loading: boolean;
  formGroup: FormGroup;
  initialVerifyStatus = 'Verify';
  successVerifyStatus = 'Verified';
  matcher = new DoraErrorStateMatcher();

  get formControls() {
    return this.sources[this.selected];
  }

  get startDate() {
    const startDate = this.configForm.get('startDate').value;
    return this.utils.convertStartTimeToTimestamp(startDate);
  }

  get endDate() {
    const endDate = this.configForm.get('endDate').value;
    return this.utils.convertEndTimeToTimestamp(endDate);
  }

  get isValidDate() {
    return this.startDate && this.endDate && this.endDate - this.startDate > 0;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFormControl(true);
    this.dateChangeListener();
  }

  // Need to improve it later. Better to put default value to config
  initFormControl(isInit: boolean) {
    const defaultTypeValue = this.getValueByControlName('type', Object.keys(this.sources)[0], isInit);
    this.selected = isInit ? defaultTypeValue : this.selected;
    this.formGroup = this.formBuilder.group(
      Object.assign(
        {
          type: [this.selected, Validators.required],
          verifyToken: [this.initialVerifyStatus, []],
        },
        ...this.getFormControls(isInit)
      )
    );
    this.configForm.setControl(this.groupName, this.formGroup);

    this.valueChanges();
  }

  getValueByControlName(key, defaultValue, isInit) {
    if (!isInit || !this.importData) {
      return defaultValue;
    }
    if (!this.importData[this.groupName] || !Object.keys(this.importData[this.groupName]).includes(key)) {
      this.openMessage('Import data is not perfectly matched. Please review carefully before going next!');
      return defaultValue;
    }
    return this.importData[this.groupName][key];
  }

  getFormControls(isInit) {
    return Object.keys(this.formControls).map((controlName) => {
      const defaultValue = this.getValueByControlName(controlName, '', isInit);
      return {
        [controlName]: [defaultValue, this.formControls[controlName]],
      };
    });
  }

  dateChangeListener() {
    this.configForm.get('startDate').valueChanges.subscribe(() => {
      this.formGroup.patchValue({ verifyToken: this.initialVerifyStatus });
    });
    this.configForm.get('endDate').valueChanges.subscribe(() => {
      this.formGroup.patchValue({ verifyToken: this.initialVerifyStatus });
    });
    this.configForm.get('considerHoliday').valueChanges.subscribe(() => {
      this.formGroup.patchValue({ verifyToken: this.initialVerifyStatus });
    });
  }

  valueChanges() {
    Object.keys(this.formControls).forEach((controlName) => {
      this.formGroup.get(controlName).valueChanges.subscribe(() => {
        if (this.formGroup.get('verifyToken').value === this.successVerifyStatus) {
          this.formGroup.patchValue({ verifyToken: this.initialVerifyStatus });
        }
      });
    });
  }

  selectionChange() {
    this.initFormControl(false);
  }

  openMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  }

  onVerify() {
    if (this.formGroup.get('verifyToken').value === this.successVerifyStatus) {
      return;
    }

    this.loading = true;
    this.apiService
      .verify({
        type: this.groupName,
        params: Object.assign({}, this.formGroup.value, { startTime: this.startDate, endTime: this.endDate }),
      })
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.formGroup.patchValue({
            verifyToken: this.successVerifyStatus,
          });
          if (response) {
            this.verify.emit({
              formGroupName: this.groupName,
              value: {
                type: this.formGroup.value.type,
                data: response,
              },
            });
          }
        },
        (response) => {
          this.loading = false;
          if (response.status === exceptionCode.thereIsNoCardInDoneColumn) {
            const tipMessage = 'Sorry there is no card has been done, please change your collection date!';
            this.dialog.open(MessageDialogComponent, { disableClose: true, data: tipMessage });
            return;
          }

          this.openMessage(`${this.selected} verify failed`);
        }
      );
  }

  reset() {
    this.formGroup.reset({
      type: this.selected,
      verifyToken: this.initialVerifyStatus,
    });
  }

  ngOnDestroy(): void {
    this.configForm.removeControl(this.groupName);
  }
}
