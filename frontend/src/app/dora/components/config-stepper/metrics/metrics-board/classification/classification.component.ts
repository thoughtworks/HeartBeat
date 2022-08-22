import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { TargetField } from '../../../../../types/board';
import { controlNames, metricsConstant } from '../../../../../utils/constant';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
})
export class ClassificationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metricsForm: FormGroup;
  @Input() classifications: TargetField[];
  @Input() importClassificationKeys: string[];

  classificationsControlName = controlNames.classifications;
  distinguishAll = metricsConstant.crewAll;
  warningMessagesForImport: string[] = [];

  @ViewChild('allSelected') private allSelected: MatOption;

  constructor() {}

  ngOnInit() {
    const defaultValue =
      this.importClassificationKeys && this.importClassificationKeys.length > 0
        ? this.getDefaultValue(this.importClassificationKeys)
        : '';
    this.metricsForm.addControl(this.classificationsControlName, new FormControl(defaultValue));
  }

  ngOnChanges({ classifications }: SimpleChanges): void {
    if (classifications && !classifications.firstChange) {
      this.metricsForm.get(this.classificationsControlName).reset();
    }
  }

  getDefaultValue(importClassificationKeys: string[]) {
    const warningMessage = 'Some classifications in import data might be removed now.';
    const includeClassifications = importClassificationKeys.filter(
      (item) => !!this.classifications.find((i) => i.key === item)
    );
    if (includeClassifications.length === 0) {
      this.addWarningMessage(warningMessage);
      return '';
    }
    const isEveryImportIncluded = importClassificationKeys.every(
      (item) => !!this.classifications.find((i) => i.key === item)
    );
    if (!isEveryImportIncluded) {
      this.addWarningMessage(warningMessage);
    }
    if (includeClassifications.length === this.classifications.length) {
      includeClassifications.push(this.distinguishAll);
    }
    return includeClassifications;
  }

  togglePerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.metricsForm.controls[this.classificationsControlName].value.length === this.classifications.length) {
      this.allSelected.select();
    }
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      const classificationsKey = this.classifications.map((classification) => classification.key);
      const allOptions = [...classificationsKey, this.distinguishAll];
      this.metricsForm.controls[this.classificationsControlName].patchValue(allOptions);
    } else {
      this.metricsForm.controls[this.classificationsControlName].patchValue([]);
    }
  }

  ngOnDestroy(): void {
    this.metricsForm.removeControl(this.classificationsControlName);
  }

  addWarningMessage(message: string) {
    this.warningMessagesForImport.push(message);
  }
}
