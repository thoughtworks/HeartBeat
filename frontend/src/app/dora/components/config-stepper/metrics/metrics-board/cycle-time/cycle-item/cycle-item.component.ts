import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { controlNames, cycleTimeList } from '../../../../../../utils/constant';

@Component({
  selector: 'app-cycle-item',
  templateUrl: './cycle-item.component.html',
  styleUrls: ['./cycle-item.component.scss'],
})
export class CycleItemComponent implements OnChanges {
  @Input() cycleItem: AbstractControl;
  @Input() metricsForm: FormGroup;
  @Input() groupName: string;
  @Input() cycleTimeGroupName: string;
  @Output() selectionChange = new EventEmitter();

  cycleTimeControlName = controlNames.cycleTime;
  jiraColumnsControlName = controlNames.jiraColumns;
  columnItemKey: string;
  cycleTimeList = cycleTimeList;

  constructor() {}

  get jiraColumnsControl() {
    return this.metricsForm.controls[this.cycleTimeControlName].get(this.jiraColumnsControlName) as FormArray;
  }

  ngOnChanges(): void {
    if (this.cycleItem) {
      this.columnItemKey = Object.keys(this.cycleItem.value)[0];
    }
  }

  onSelectionChange() {
    this.selectionChange.emit();
  }
}
