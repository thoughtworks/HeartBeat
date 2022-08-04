import {Component, Input, OnInit} from '@angular/core';
import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import {
  LatestSprintBlockReason
} from "../../../types/reportResponse";

@Component({
  selector: 'app-block-reason-percentage-report',
  templateUrl: './block-reason-percentage.component.html',
  styleUrls: ['./block-reason-percentage.component.scss'],
})
export class BlockReasonPercentageReportComponent implements OnInit {
  @Input() latestSprintBlockReason: LatestSprintBlockReason;

  ngOnInit(): void {
    const myChart = echarts.init(document.getElementById('blockReasonPercentage'));

    myChart.setOption(this.getOption());
  }

  getDevelopingAndBlockPercentage() {
    const latestSprintDevelopingPercentage: number = (1 - this.latestSprintBlockReason.totalBlockedPercentage) * 100;
    const latestSprintBlockPercentage: number = (this.latestSprintBlockReason.totalBlockedPercentage) * 100;

    const developingAndBlockPercentage = [{
      value: latestSprintDevelopingPercentage,
      name: String(latestSprintDevelopingPercentage) + '% \n developing percentage'
    }, {
      value: latestSprintBlockPercentage, name: String(latestSprintBlockPercentage) + '% \n block percentage'
    }];
    return developingAndBlockPercentage;
  }


  getOption() {
    const blockReasonPercentage = this.latestSprintBlockReason.blockReasonPercentage;

    const allBlockReason = [];
    blockReasonPercentage.forEach((curBlockReasonPercentage) => {
      allBlockReason.push(curBlockReasonPercentage.reasonName);
    });

    const seriesLabel = {
      show: true,
      color: "#FFF",
      formatter: (params) => {
        if (params.value > 0) {
          return params.value * 100 + '%';
        } else {
          return '';
        }
      },
    };

    const blockReason = "Block Reason";
    const myOption: EChartsOption = {
      legend: {
        data: allBlockReason,
        left: '78%',
        top: '30%',
        orient: 'vertical',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {},
      title: [
        {
          text: 'Block Reason - Latest Iteration',
          left: '50%',
          top: '5%',
          textAlign: 'center',
          textStyle: {
            fontSize: 30
          }
        }
      ],
      grid: [
        {
          width: '15%',
          left: '60%',
          top: '20%',
          containLabel: true
        }
      ],
      xAxis: [
        {
          type: "category",
          show: false
        },
      ],
      yAxis: [
        {
          type: "value",
          show: false
        },
      ],
      series: [
        {
          name: blockReasonPercentage[0].reasonName,
          type: "bar",
          barWidth: 150,
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[0].percentage],
          label: seriesLabel,
          color: '#f1c94d'
        },
        {
          name: blockReasonPercentage[1].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[1].percentage],
          label: seriesLabel,
          color: '#fd9331',
        },
        {
          name: blockReasonPercentage[2].reasonName,
          type: "bar",
          stack: "Block Reason",
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[2].percentage],
          label: seriesLabel,
          color: '#f1424e'
        },
        {
          name: blockReasonPercentage[3].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[3].percentage],
          color: '#1fb283',
          label: seriesLabel,
        },
        {
          name: blockReasonPercentage[4].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[4].percentage],
          label: seriesLabel,
          color: '#8963a6',
        },
        {
          name: blockReasonPercentage[5].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[5].percentage],
          label: seriesLabel,
          color: '#1d7482',
        },
        {
          name: blockReasonPercentage[6].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[6].percentage],
          label: seriesLabel,
          color: '#b2890f',
        },
        {
          name: blockReasonPercentage[7].reasonName,
          type: "bar",
          stack: blockReason,
          emphasis: {
            focus: "series",
          },
          data: [blockReasonPercentage[7].percentage],
          label: seriesLabel,
        },
        {
          color: ['#00b150', '#7031a1'],
          type: 'pie',
          radius: [0, '40%'],
          center: ['30%', '50%'],
          data: this.getDevelopingAndBlockPercentage(),
          label: {
            fontSize: 14,
          },
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: {backgroundColor: "#FFF"}
        }
      }
    };
    return myOption;
  }
}
