export interface BarOptionProps {
  title: string;
  legend: string;
  xAxis: string[];
  yAxis: yAxis;
  series: Series[] | undefined;
  color: string[];
}

export interface LineOptionProps {
  title: string;
  legend: string;
  xAxis: string[];
  yAxis: yAxis;
  series: Series;
  color: string;
}
export interface Series {
  name: string;
  type: string;
  data: number[];
}
export interface yAxis {
  name: string;
  alignTick: boolean;
  axisLabel: string;
}

export const oneLineOptionMapper = (props: LineOptionProps) => {
  return {
    title: {
      text: props.title,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      data: props.xAxis,
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          width: 2,
        },
      },
      axisLabel: {
        show: true,
        fontSize: 12,
      },
    },
    color: [props.color],
    yAxis: {
      name: props.yAxis.name,
      type: 'value',
      nameTextStyle: {
        align: 'left',
      },
      paddingLeft: 10,
      axisLabel: {
        show: true,
        interval: 'auto',
        formatter: `{value}${props.yAxis.axisLabel}`,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          width: 2,
        },
      },
    },
    grid: {
      show: true,
      left: '7%',
      right: '4%',
    },
    series: {
      name: props.series.name,
      data: props.series.data,
      type: props.series.type,
      smooth: true,
      areaStyle: {
        opacity: 0.3,
      },
    },
  };
};
export const stackedBarOptionMapper = (props: BarOptionProps) => {
  return {
    title: {
      text: props.title,
      textStyle: {
        fontSize: 16,
      },
    },
    legend: {
      icon: 'circle',
      data: props.series?.map((item) => item.name),
      bottom: 1,
      left: 10,
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      show: true,
      left: '7%',
      right: '4%',
    },
    xAxis: {
      data: props.xAxis,
    },
    yAxis: {
      name: props.yAxis.name,
      nameTextStyle: {
        align: 'left',
      },
      type: 'value',
      alignTick: false,
    },
    color: props.color,
    series: props.series?.map((item) => {
      return {
        name: item.name,
        data: item.data,
        barWidth: 30,
        type: item.type,
        stack: 'x',
      };
    }),
  };
};
