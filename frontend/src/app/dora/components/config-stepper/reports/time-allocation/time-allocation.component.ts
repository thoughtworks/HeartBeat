import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { BlockedAndDevelopingPercentage } from '../../../../types/reportResponse';

@Component({
  selector: 'app-time-allocation-report',
  templateUrl: './time-allocation.component.html',
  styleUrls: ['./time-allocation.component.scss'],
})
export class TimeAllocationReportComponent implements OnInit {
  @Input() blockedAndDevelopingPercentage: BlockedAndDevelopingPercentage[];

  ngOnInit(): void {
    const myCharts = echarts.init(document.getElementById('timeAllocation'));

    const sprintName = [];
    const blockedPercentage = [];
    const developingPercentage = [];

    this.blockedAndDevelopingPercentage.forEach((curData) => {
      sprintName.push(curData.sprintName);
      blockedPercentage.push(parseFloat((curData.value.blockedPercentage * 100).toFixed(0)));
      developingPercentage.push(parseFloat((curData.value.developingPercentage * 100).toFixed(0)));
    });

    const seriesLabel = {
      show: true,
      color: '#000',
      textStyle: {
        fontSize: 13,
      },
    };

    const myOption: EChartsOption = {
      title: {
        text: 'Time Allocation',
        left: '50%',
        textAlign: 'center',
        textStyle: {
          fontSize: 15,
        },
        top: '3%',
      },
      legend: {
        data: ['Developing Time', 'Blocked Time'],
        top: '10%',
        textStyle: { fontSize: 13 },
      },
      grid: {
        containLabel: true,
        backgroundColor: 'white',
        show: true,
        bottom: '3%',
        top: '20%',
        left: '14%',
        right: '14%',
      },

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: sprintName,
          axisLabel: { interval: 0, rotate: 30 },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Developing Time',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          label: seriesLabel,
          data: developingPercentage,
          color: 'rgba(0,177,80,1)',
        },
        {
          name: 'Blocked Time',
          type: 'line',
          stack: 'Total',
          label: seriesLabel,
          areaStyle: {},
          data: blockedPercentage,
          color: 'rgba(112,49,161,1)',
        },
      ],
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
    };
    myCharts.setOption(myOption);
  }
}
