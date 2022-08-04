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
    // const mockCompletedCardsNumber = [
    //   { sprintName: 'Iteration30', value: 11 },
    //   { sprintName: 'Iteration31', value: 8 },
    //   { sprintName: 'Iteration32', value: 11 },
    //   { sprintName: 'Iteration33', value: 12 },
    //   { sprintName: 'Iteration34', value: 13 },
    //   { sprintName: 'Iteration35', value: 6 },
    //   { sprintName: 'Iteration36', value: 13 },
    //   { sprintName: 'Iteration37', value: 8 },
    //   { sprintName: 'Iteration38', value: 11 },
    //   { sprintName: 'Iteration39', value: 8 },
    // ];
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
    const myOption: EChartsOption = {
      title: {
        text: 'Throughput - Completed Cards By Sprint',
        left: 'center',
        textStyle: {
          color: '#595959',
          fontSize: 30,
        },
        top: '1%',
      },
      xAxis: {
        type: 'category',
        data: sprintName,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          align: 'center',
          color: '#595959',
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
          color: '#595959',
          fontSize: 14,
        },
        min: Math.min(...cardsNumber) - 2,
        scale: true,
      },
      series: [
        {
          data: cardsNumber,
          type: 'line',
          smooth: true,
          symbolSize: 0.1,
          label: { show: true, fontSize: 14, color: '#404040' },
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
                  coord: [this.completedCardsNumber[sprintNumber - 1].sprintName, model.m * sprintNumber + model.b],
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
