import { Classification } from './../../../types/reportResponse';
import { Component, OnInit, Input } from '@angular/core';
import { ClassificationReport } from 'src/app/dora/types/report';

@Component({
  selector: 'app-classification-report',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
})
export class ClassificationReportComponent implements OnInit {
  @Input() classifications: Classification[];

  displayedColumns: string[] = ['fieldName', 'subtitle', 'value'];
  dataSource: ClassificationReport[];

  constructor() {}

  spans = [];
  cacheSpan(array: Classification[]) {
    for (let i = 0; i < array.length; ) {
      const currentValue = array[i].fieldName;
      const count = array.filter((item) => item.fieldName === currentValue).length;
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i].FieldName = count;
      i += count;
    }
  }

  getRowSpan(col: string, index: number) {
    return this.spans[index] && this.spans[index][col.toString()];
  }

  ngOnInit(): void {
    const array = this.classifications.reduce((current, next) => {
      next.pairs.forEach((pair) => {
        current.push({ fieldName: next.fieldName, pairs: pair });
      });
      return current;
    }, []);
    this.cacheSpan(array);
    this.dataSource = array;
  }
}
