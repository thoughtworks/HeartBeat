import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import * as simpleStatistics from 'simple-statistics';
import { EChartsOption } from 'echarts';
import { LatestSprintBlockReason } from '../../../../types/reportResponse';
import { StandardDeviation } from 'src/app/dora/types/reportResponse';
import { CompletedCardsNumber } from 'src/app/dora/types/reportResponse';
import { BlockedAndDevelopingPercentage } from '../../../../types/reportResponse';
@Component({
  selector: 'app-secondary-metrics-report',
  templateUrl: './secondary-metrics.component.html',
  styleUrls: ['./secondary-metrics.component.scss'],
})
export class SecondaryMetricsReportComponent implements OnInit {
  @Input() completedCardsNumber: CompletedCardsNumber[];
  @Input() standardDeviation: StandardDeviation[];
  @Input() latestSprintBlockReason: LatestSprintBlockReason;
  @Input() blockedAndDevelopingPercentage: BlockedAndDevelopingPercentage[];

  ngOnInit(): void {
    const cardsNumber: number[] = [];
    const sprintName: string[] = [];
    this.completedCardsNumber.forEach((curSprint) => {
      cardsNumber.push(curSprint.value);
      sprintName.push(curSprint.sprintName);
    });

    const standardDeviationArray: number[] = [];
    const averageCycleTimeArray: number[] = [];
    this.standardDeviation.forEach((sprint) => {
      standardDeviationArray.push(sprint.value.standardDeviation);
      averageCycleTimeArray.push(sprint.value.average);
    });

    const blockedPercentage: number[] = [];
    const developingPercentage: number[] = [];

    this.blockedAndDevelopingPercentage.forEach((curData) => {
      blockedPercentage.push(parseFloat((curData.value.blockedPercentage * 100).toFixed(0)));
      developingPercentage.push(parseFloat((curData.value.developingPercentage * 100).toFixed(0)));
    });

    const allBlockReason = [];
    const blockReasonPercentage = this.latestSprintBlockReason.blockReasonPercentage;
    blockReasonPercentage.forEach((curBlockReasonPercentage) => {
      allBlockReason.push(curBlockReasonPercentage.reasonName);
    });

    const arrayRegression = [];
    let x = 0;
    for (let i = 0; i < sprintName.length; i++) {
      const cur = cardsNumber[i];
      x += 1;
      arrayRegression.push([x, cur]);
    }
    const model = simpleStatistics.linearRegression(arrayRegression);
    const firstRegressionValue = this.calculateTrendLinePoint(model, 1);
    const lastRegressionValue = this.calculateTrendLinePoint(model, sprintName.length);

    const seriesLabel = {
      show: true,
      color: '#000',
      textStyle: {
        fontSize: 14,
      },
    };
    const seriesLabel2 = {
      show: true,
      color: '#FFF',
      formatter: (params) => {
        if (params.value > 0) {
          return (params.value * 100).toFixed(0) + '%';
        } else {
          return '';
        }
      },
    };
    const blockReason = 'Block Reason';

    const myCharts = echarts.init(document.getElementById('secondary-metrics'));

    const myOption: EChartsOption = {
      legend: [
        {
          data: ['Developing Time', 'Blocked Time'],
          left: '61%',
          top: '2.5%',
          textStyle: { fontSize: 12 },
        },

        {
          data: ['Standard Deviation for Population', 'Avg Cycle Time'],
          top: '53%',
          left: '9%',
          textStyle: { fontSize: 12 },
        },

        {
          data: allBlockReason,
          left: '83%',
          top: '60%',
          orient: 'vertical',
          textStyle: {
            fontSize: 12,
          },
        },
      ],

      tooltip: {},
      title: [
        {
          text: 'Throughput - Completed Cards By Sprint',
          left: '25%',
          textAlign: 'center',
          textStyle: {
            fontSize: 15,
          },
        },
        {
          text: 'Time Allocation',
          left: '75%',
          textAlign: 'center',
          textStyle: {
            fontSize: 15,
          },
        },
        {
          text: 'Avg Cycle Time - Day',
          left: '25%',
          top: '50%',
          textAlign: 'center',
          textStyle: {
            fontSize: 15,
          },
        },
        {
          text: 'Block Reason - Latest Iteration',
          left: '75%',
          top: '50%',
          textAlign: 'center',
          textStyle: {
            fontSize: 15,
          },
        },
      ],
      grid: [
        { left: '7%', top: '7%', width: '36%', height: '36%' },
        { right: '7%', top: '7%', width: '36%', height: '36%' },
        { left: '7%', bottom: '7%', width: '36%', height: '36%' },
        { right: '3%', bottom: '16%', width: '36%', height: '25%' },
      ],
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: sprintName,
          axisLabel: { interval: 0, rotate: 30 },
          gridIndex: 0,
          axisTick: {
            alignWithLabel: true,
          },
        },
        {
          type: 'category',
          boundaryGap: false,
          data: sprintName,
          axisLabel: { interval: 0, rotate: 30 },
          gridIndex: 1,
        },
        {
          type: 'category',
          boundaryGap: true,
          data: sprintName,
          axisLabel: { interval: 0, rotate: 30 },
          gridIndex: 2,
          axisTick: {
            alignWithLabel: true,
          },
        },
        {
          type: 'category',
          show: false,
          gridIndex: 3,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
          },
          gridIndex: 0,
        },
        {
          type: 'value',
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
          },
          gridIndex: 1,
        },
        {
          type: 'value',
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
          },
          gridIndex: 2,
        },
        {
          type: 'value',
          show: false,
          gridIndex: 3,
        },
      ],
      series: [
        {
          type: 'line',
          smooth: true,
          symbolSize: 0.1,
          label: { show: true, fontSize: 13 },
          lineStyle: {
            width: 5,
            color: '#0070c0',
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: cardsNumber,
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
        {
          name: 'Developing Time',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          label: seriesLabel,
          data: developingPercentage,
          color: '#00b150',
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
        {
          name: 'Blocked Time',
          type: 'line',
          stack: 'Total',
          label: seriesLabel,
          areaStyle: {},
          data: blockedPercentage,
          color: '#7031a1',
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
        {
          type: 'line',
          name: 'Standard Deviation for Population',
          smooth: true,
          color: '#d67b2a',
          symbolSize: 10,
          symbol: 'circle',
          label: { show: true, fontSize: 13 },
          lineStyle: { width: 5 },
          xAxisIndex: 2,
          yAxisIndex: 2,

          data: standardDeviationArray,
        },
        {
          type: 'line',
          name: 'Avg Cycle Time',
          xAxisIndex: 2,
          yAxisIndex: 2,
          smooth: true,
          color: '#f0434d',
          symbolSize: 10,
          symbol: 'circle',
          label: { show: true, fontSize: 13 },
          lineStyle: { width: 5 },

          data: averageCycleTimeArray,
        },
        {
          name: blockReasonPercentage[0].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          barWidth: 25,

          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[0].percentage],
          label: seriesLabel2,
          color: '#f1c94d',
        },
        {
          name: blockReasonPercentage[1].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: 'Block Reason',
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[1].percentage],
          label: seriesLabel2,
          color: '#fd9331',
        },
        {
          name: blockReasonPercentage[2].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: 'Block Reason',
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[2].percentage],
          label: seriesLabel2,
          color: '#f1424e',
        },
        {
          name: blockReasonPercentage[3].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[3].percentage],
          color: '#1fb283',
          label: seriesLabel2,
        },
        {
          name: blockReasonPercentage[4].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[4].percentage],
          label: seriesLabel2,
          color: '#8963a6',
        },
        {
          name: blockReasonPercentage[5].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[5].percentage],
          label: seriesLabel2,
          color: '#1d7482',
        },
        {
          name: blockReasonPercentage[6].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[6].percentage],
          label: seriesLabel2,
          color: '#b2890f',
        },
        {
          name: blockReasonPercentage[7].reasonName,
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          stack: blockReason,
          emphasis: {
            focus: 'series',
          },
          data: [blockReasonPercentage[7].percentage],
          label: seriesLabel2,
        },
        {
          color: ['#00b150', '#7031a1'],
          type: 'pie',
          radius: '15%',
          left: 40,
          center: ['60%', '70%'],
          data: this.getDevelopingAndBlockPercentage(),
        },
      ],
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
  getDevelopingAndBlockPercentage() {
    const latestSprintDevelopingPercentage: number = parseFloat(
      ((1 - this.latestSprintBlockReason.totalBlockedPercentage) * 100).toFixed(0)
    );
    const latestSprintBlockPercentage: number = parseFloat(
      (this.latestSprintBlockReason.totalBlockedPercentage * 100).toFixed(0)
    );

    const developingAndBlockPercentage = [
      {
        value: latestSprintDevelopingPercentage,
        name: String(latestSprintDevelopingPercentage) + '% \n developing percentage',
      },
      {
        value: latestSprintBlockPercentage,
        name: String(latestSprintBlockPercentage) + '% \n block percentage',
      },
    ];
    return developingAndBlockPercentage;
  }
}
