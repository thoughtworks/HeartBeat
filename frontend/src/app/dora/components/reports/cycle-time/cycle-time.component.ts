import { Component, OnInit, Input } from '@angular/core';
import { CycleTime } from 'src/app/dora/types/reportResponse';
import { Report } from 'src/app/dora/types/report';
import { cycleTimeReport } from 'src/app/dora/utils/config';
import { RowSpanComputer, Span } from './row-span-computer';

@Component({
  selector: 'app-cycle-time-report',
  templateUrl: './cycle-time.component.html',
  styleUrls: ['./cycle-time.component.scss'],
})
export class CycleTimeReportComponent implements OnInit {
  @Input() cycleTime: CycleTime;

  displayedColumns: string[] = ['name', 'value'];
  dataSource: Report[];
  rowSpans: Array<Span[]>;
  private rowSpanComputer = new RowSpanComputer();

  constructor() {}

  ngOnInit(): void {
    this.dataSource = cycleTimeReport
      .map((item) => {
        let calculatedValue: string = this.getCycleTimeValue(this.cycleTime, item);
        if (calculatedValue !== '') {
          calculatedValue += item.unit === undefined ? '' : item.unit;
        }
        return {
          name: item.name,
          value: calculatedValue,
        };
      })
      .filter((item) => item.value !== '');
    this.computeRowSpans();
  }

  getCycleTimeValue(cycleTime: CycleTime, item) {
    if (cycleTime[item.id]) {
      return cycleTime[item.id];
    } else {
      const currentSwimlane = cycleTime.swimlaneList.find((swimlane) => swimlane.optionalItemName === item.type);
      return currentSwimlane
        ? item.id === 'totalTime'
          ? (currentSwimlane[item.id] / cycleTime.totalTimeForCards).toFixed(2)
          : currentSwimlane[item.id]
        : '';
    }
  }

  private computeRowSpans(): void {
    this.rowSpans = this.rowSpanComputer.compute(this.dataSource, this.displayedColumns);
  }
}
