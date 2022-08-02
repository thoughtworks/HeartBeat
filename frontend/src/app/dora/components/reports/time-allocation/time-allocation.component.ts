import { Component, OnInit } from '@angular/core';
import * as echarts from "echarts";
import {EChartsOption} from "echarts";

@Component({
  selector: 'app-time-allocation-report',
  templateUrl: './time-allocation.component.html',
  styleUrls: ['./time-allocation.component.scss'],
})
export class TimeAllocationReportComponent implements OnInit {
  ngOnInit(): void {
    const myCharts = echarts.init(document.getElementById("timeAllocation"));
    const myOption: EChartsOption = {};
    myCharts.setOption(myOption);
  }
}
