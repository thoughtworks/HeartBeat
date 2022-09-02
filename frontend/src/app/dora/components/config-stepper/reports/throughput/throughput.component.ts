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

    const arrayRegression = [];
    let x = 0;
    for (let i = 0; i < sprintNumber; i++) {
      const cur = cardsNumber[i];
      x += 1;
      arrayRegression.push([x, cur]);
    }

    const model = ss.linearRegression(arrayRegression);
    const myCharts = echarts.init(document.getElementById('throughput'));
    const firstRegressionValue = this.calculateTrendLinePoint(model, 1);
    const lastRegressionValue = this.calculateTrendLinePoint(model, sprintNumber);
    const myOption: EChartsOption = {
      title: {
        text: 'Throughput - Completed Cards By Sprint',
        left: '50%',
        textAlign: 'center',
        textStyle: {
          fontSize: 15,
        },
        top: '3%',
      },

      grid: {
        bottom: '3%',
        top: '20%',
        left: '14%',
        right: '14%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: sprintName,
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },
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
          label: { show: true, fontSize: 13 },
          lineStyle: {
            width: 5,
            color: '#0070c0',
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              type: 'dotted',
              width: 5,
              color: '#39bcd2',
            },
            data: [
              [
                {
                  coord: [this.completedCardsNumber[firstRegressionValue.x - 1].sprintName, firstRegressionValue.y],
                },
                {
                  coord: [this.completedCardsNumber[lastRegressionValue.x - 1].sprintName, lastRegressionValue.y],
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

  calculateTrendLinePoint(model: { m: number; b: number }, xAxis: number): { x: number; y: number } {
    const yTemp = model.m * xAxis + model.b;
    let xValue = xAxis;

    if (yTemp < 0) {
      const xIntersection = Math.floor((0 - model.b) / model.m);
      if (xIntersection >= 0) {
        xValue = model.m > 0 ? xIntersection + 1 : xIntersection;
      } else {
        xValue = 1;
      }
    }

    return {
      x: xValue,
      y: xValue * model.m + model.b,
    };
  }
}
