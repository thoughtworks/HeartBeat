import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { StandardDeviation } from 'src/app/dora/types/reportResponse';
@Component({
  selector: 'app-average-cycle-time-report',
  templateUrl: './average-cycle-time.component.html',
  styleUrls: ['./average-cycle-time.component.scss'],
})
export class AverageCycleTimeReportComponent implements OnInit {
  @Input() standardDeviation: StandardDeviation[];
  constructor() {}
  ngOnInit(): void {
    const iterationNameArray: string[] = [];
    const standardDeviationArray: number[] = [];
    const averageCycleTimeArray: number[] = [];
    this.standardDeviation.forEach((sprint) => {
      iterationNameArray.push(sprint.sprintName);
      standardDeviationArray.push(sprint.value.standardDeviation);
      averageCycleTimeArray.push(sprint.value.average);
    });

    const myCharts = echarts.init(document.getElementById('averageCycleTime'));
    let myOption: EChartsOption = {};

    myOption = {
      title: {
        text: 'Avg Cycle Time - Day',
        left: '50%',
        textAlign: 'center',
        textStyle: {
          fontSize: 30,
        },
        top: '3%',
      },
      legend: {
        data: ['Standard Deviation for Population', 'Avg Cycle Time'],
        top: '10%',
        textStyle: { fontSize: 14 },
      },
      grid: {
        bottom: '3%',
        top: '20%',
        left: '14.5%',
        right: '14%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        axisTick: {
          alignWithLabel: true,
        },
        type: 'category',
        boundaryGap: true,
        data: iterationNameArray,
      },
      yAxis: {
        axisLine: {
          show: true,
        },
        splitLine: {
          show: false,
        },
        type: 'value',
      },
      series: [
        {
          data: standardDeviationArray,
          name: 'Standard Deviation for Population',
          type: 'line',
          smooth: true,
          color: '#d67b2a',
          symbolSize: 10,
          symbol: 'circle',
          label: { show: true, fontSize: 14 },
          lineStyle: { width: 5 },
        },

        {
          data: averageCycleTimeArray,
          name: 'Avg Cycle Time',
          type: 'line',
          smooth: true,
          color: '#f0434d',
          symbolSize: 10,
          symbol: 'circle',
          label: { show: true, fontSize: 14 },
          lineStyle: { width: 5 },
        },
      ],
    };
    myCharts.setOption(myOption);
  }
}
function getStandardDeviationArray() {
  throw new Error('Function not implemented.');
}

function standardDeviatio(standardDeviation: any) {
  throw new Error('Function not implemented.');
}
