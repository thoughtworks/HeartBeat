import { Component, OnInit, Input } from '@angular/core';
import { Velocity } from 'src/app/dora/types/reportResponse';
import { velocityReport } from 'src/app/dora/utils/config';
import { Report } from 'src/app/dora/types/report';

@Component({
  selector: 'app-velocity-report',
  templateUrl: './velocity.component.html',
  styleUrls: ['./velocity.component.scss'],
})
export class VelocityReportComponent implements OnInit {
  @Input() velocity: Velocity;

  displayedColumns: string[] = ['name', 'value'];
  dataSource: Report[];

  constructor() {}

  ngOnInit(): void {
    this.dataSource = velocityReport.map(({ id, name }) => ({
      name,
      value: this.velocity[id],
    }));
  }
}
