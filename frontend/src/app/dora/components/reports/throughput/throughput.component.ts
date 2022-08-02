import { Component, OnInit } from '@angular/core';
import * as echarts from "echarts";
import {EChartsOption} from "echarts";

@Component({
  selector: 'app-throughput-report',
  templateUrl: './throughput.component.html',
  styleUrls: ['./throughput.component.scss'],
})
export class ThroughputReportComponent implements OnInit {
  ngOnInit(): void {
    const myCharts = echarts.init(document.getElementById("throughput"));
    const myOption: EChartsOption = {};
    myCharts.setOption(myOption);
  }
}
