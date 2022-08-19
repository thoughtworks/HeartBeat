import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { controlNames, metricsConstant } from '../../../../../utils/constant';
import { DoraErrorStateMatcher } from '../../../../../utils/doraErrorStateMatcher';

@Component({
  selector: 'app-crews',
  templateUrl: './crews.component.html',
  styleUrls: ['./crews.component.scss'],
})
export class CrewsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metricsForm: FormGroup;
  @Input() boardCrews: string[];
  @Input() importCrews: string[];

  matcher = new DoraErrorStateMatcher();
  crewsControlName = controlNames.crews;
  crewAllConstant = metricsConstant.crewAll;
  @ViewChild('allSelected') private allSelected: MatOption;

  constructor() {}

  ngOnInit(): void {
    const defaultValue = this.importCrews ? this.getDefaultValue(this.importCrews) : '';
    this.metricsForm.addControl(this.crewsControlName, new FormControl(defaultValue));
  }

  ngOnChanges({ boardCrews }: SimpleChanges): void {
    if (boardCrews && !boardCrews.firstChange) {
      this.metricsForm.get(this.crewsControlName).reset();
    }
  }

  getDefaultValue(importCrews: string[]) {
    const includeCrews = importCrews.filter((item) => this.boardCrews.includes(item));
    if (includeCrews.length === 0) {
      return '';
    }
    if (includeCrews.length === this.boardCrews.length) {
      includeCrews.push(this.crewAllConstant);
    }
    return includeCrews;
  }

  togglePerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.metricsForm.controls[this.crewsControlName].value.length === this.boardCrews.length) {
      this.allSelected.select();
    }
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      const allOptions = [...this.boardCrews, this.crewAllConstant];
      this.metricsForm.controls[this.crewsControlName].patchValue(allOptions);
    } else {
      this.metricsForm.controls[this.crewsControlName].patchValue([]);
    }
  }

  ngOnDestroy(): void {
    this.metricsForm.removeControl(this.crewsControlName);
  }
}
