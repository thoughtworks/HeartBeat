import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { CompletedCardsNumber } from 'src/app/dora/types/reportResponse';
import * as ss from 'simple-statistics';

@Component({
  selector: 'app-throughput-report',
  templateUrl: './throughput.component.html',
  styleUrls: ['./throughput.component.scss'],
})
export class ThroughputReportComponent implements OnInit {
  @Input() completedCardsNumber: CompletedCardsNumber[];

  ngOnInit(): void {
    const sprintNumber = this.completedCardsNumber.length;
    const cardsNumber = [];
    const sprintName = [];
    this.completedCardsNumber.forEach((curSprint) => {
      cardsNumber.push(curSprint.value);
      sprintName.push(curSprint.sprintName);
    });
    const array = [];
    let x = 0;
    for (let i = 0; i < sprintNumber; i++) {
      const cur = cardsNumber[i];
      x += 1;
      array.push([x, cur]);
    }

    const model = ss.linearRegression(array);
    const myCharts = echarts.init(document.getElementById('throughput'));
    let lastRegressionValue = model.m * sprintNumber + model.b ? 0 : model.m * sprintNumber + model.b;
    const myOption: EChartsOption = {
      title: {
        text: 'Throughput - Completed Cards By Sprint',
        left: 'center',
        textStyle: {
          color: 'black',
          fontSize: 30,
        },
      },
      xAxis: {
        type: 'category',
        data: sprintName,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          align: 'center',
          color: 'black',
          fontSize: 14,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },
        axisLabel: {
          align: 'center',
          color: 'black',
          fontSize: 14,
        },
        min: Math.min(...cardsNumber, lastRegressionValue) - 1 ? 0 : Math.min(...cardsNumber, lastRegressionValue) - 1,
        scale: true,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data: cardsNumber,
          type: 'line',
          smooth: true,
          symbolSize: 0.1,
          label: { show: true, fontSize: 14, color: 'black' },
          lineStyle: {
            width: 3,
            color: '#0070c0',
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              type: 'dotted',
              width: 3,
              color: '#39bcd2',
            },
            data: [
              [
                {
                  coord: [this.completedCardsNumber[0].sprintName, model.m + model.b],
                },
                {
                  coord: [this.completedCardsNumber[sprintNumber - 1].sprintName, lastRegressionValue],
                },
              ],
            ],
          },
        },
      ],
      toolbox: {
        feature: {
          saveAsImage: { backgroundColor: '#FFF' },
        },
      },
    };
    myCharts.setOption(myOption);
  }
}
