import {Component, OnInit} from '@angular/core';
import * as echarts from "echarts";
import {EChartsOption} from "echarts";

@Component({
  selector: 'app-block-reason-percentage-report',
  templateUrl: './block-reason-percentage.component.html',
  styleUrls: ['./block-reason-percentage.component.scss'],
})
export class BlockReasonPercentageReportComponent implements OnInit {
  ngOnInit(): void {
    const myChart = echarts.init(document.getElementById('blockReasonPercentage'));
    const myOption: EChartsOption = {};
    myChart.setOption(myOption);
  }
}
