import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UtilsService } from '../../service/utils.service';
import { MetricsConfig } from '../../types/metrics-config';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  @Input() configForm: FormGroup;
  @Input() importData: MetricsConfig;

  radios = [
    {
      description: 'Regular Calendar (Weekend Considered)',
      value: false,
    },
    {
      description: 'Calendar with Chinese Holiday',
      value: true,
    },
  ];

  isStartPickerOpen = false;
  isEndPickerOpen = false;
  minEndDate: Date;

  constructor(private utils: UtilsService) {}

  ngOnInit(): void {
    this.initFormControl();
    this.minEndDate = this.configForm.get('startDate').value;
  }

  initFormControl() {
    const defaultStartDate = this.importData ? this.importData.startDate : new Date();
    const defaultEndDate = this.importData ? this.importData.endDate : new Date();
    const defaultIsConsiderHoliday = this.importData ? this.importData.considerHoliday : false;
    this.configForm.addControl('startDate', new FormControl(defaultStartDate, Validators.required));
    this.configForm.addControl('endDate', new FormControl(defaultEndDate, Validators.required));
    this.configForm.addControl('considerHoliday', new FormControl(defaultIsConsiderHoliday, Validators.required));
  }

  handleStartPickerClose() {
    this.isStartPickerOpen = false;
  }

  handleStartInputFocus() {
    this.isStartPickerOpen = true;
  }
  handleEndPickerClose() {
    this.isEndPickerOpen = false;
  }

  handleEndInputFocus() {
    this.isEndPickerOpen = true;
  }

  handleStartDateInput(e) {
    this.minEndDate = new Date(e.value);
  }
}
