import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import {
  oneLineOptionMapper,
  Series,
  stackedBarOptionMapper,
} from '@src/containers/ReportStep/DoraMetricsChart/ChartOption';
import { EMPTY_DATA_MAPPER_DORA_CHART, METRICS_SUBTITLE, REQUIRED_DATA } from '@src/constants/resources';
import { ReportResponse, ReportResponseDTO } from '@src/clients/report/dto/response';
import { ChartContainer, ChartWrapper } from '@src/containers/MetricsStep/style';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { theme } from '@src/theme';

interface DoraMetricsChartProps {
  dateRanges: string[];
  data: (ReportResponseDTO | undefined)[];
}

const NO_LABEL = '';
const LABEL_PERCENT = '%';

function extractedStackedBarData(allDateRanges: string[], mappedData: ReportResponse[] | undefined) {
  const extractedName = mappedData?.[0].leadTimeForChangesList?.[0].valuesList.map((item) => item.name);
  const extractedValues = mappedData?.map((data) =>
    data.leadTimeForChangesList?.[0].valuesList.map((item) => {
      return item.value!;
    }),
  );

  return {
    title: 'Lead Time For Change',
    legend: 'Lead Time For Change',
    xAxis: allDateRanges,
    yAxis: {
      name: METRICS_SUBTITLE.DEV_MEAN_TIME_TO_RECOVERY_HOURS,
      alignTick: false,
      axisLabel: NO_LABEL,
    },

    series: extractedName?.map((name, index) => {
      const series: Series = {
        name: name,
        type: 'bar',
        data: extractedValues!.map((value) => {
          return value![index] as unknown as number;
        }),
      };
      return series;
    }),

    color: [theme.main.chart.barColorA, theme.main.chart.barColorB, theme.main.chart.barColorC],
  };
}

function extractedDeploymentFrequencyData(allDateRanges: string[], mappedData: ReportResponse[] | undefined) {
  const data = mappedData?.map((item) => item.deploymentFrequencyList);
  const value = data?.map((item) => {
    return item?.[0].valueList[0].value as number;
  });
  return {
    title: REQUIRED_DATA.DEPLOYMENT_FREQUENCY,
    legend: REQUIRED_DATA.DEPLOYMENT_FREQUENCY,
    xAxis: allDateRanges,
    yAxis: {
      name: METRICS_SUBTITLE.DEPLOYMENT_FREQUENCY,
      alignTick: false,
      axisLabel: NO_LABEL,
    },
    series: {
      name: REQUIRED_DATA.DEPLOYMENT_FREQUENCY,
      type: 'line',
      data: value!,
    },
    color: theme.main.chart.deploymentFrequencyChartColor,
  };
}

function extractedChangeFailureRateData(allDateRanges: string[], mappedData: ReportResponse[] | undefined) {
  const data = mappedData?.map((item) => item.devChangeFailureRateList);
  const valueStr = data?.map((item) => {
    return item?.[0].valueList[0].value as string;
  });
  const value = valueStr?.map((item) => item?.split('%', 1)[0] as unknown as number);
  return {
    title: REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE,
    legend: REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE,
    xAxis: allDateRanges,
    yAxis: {
      name: METRICS_SUBTITLE.FAILURE_RATE,
      axisLabel: LABEL_PERCENT,
      alignTick: false,
    },
    series: {
      name: REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE,
      type: 'line',
      data: value!,
    },
    color: theme.main.chart.devChangeFailureRateColor,
  };
}

function extractedMeanTimeToRecoveryDataData(allDateRanges: string[], mappedData: ReportResponse[] | undefined) {
  const data = mappedData?.map((item) => item.devMeanTimeToRecoveryList);
  const value = data?.map((item) => {
    return item?.[0].valueList[0].value as number;
  });
  return {
    title: REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY,
    legend: REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY,
    xAxis: allDateRanges,
    yAxis: {
      name: METRICS_SUBTITLE.DEV_MEAN_TIME_TO_RECOVERY_HOURS,
      alignTick: false,
      axisLabel: NO_LABEL,
    },
    series: {
      name: REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY,
      type: 'line',
      data: value!,
    },
    color: theme.main.chart.devMeanTimeToRecoveryColor,
  };
}

export const DoraMetricsChart = ({ data, dateRanges }: DoraMetricsChartProps) => {
  const LeadTimeForChange = useRef<HTMLDivElement>(null);
  const deploymentFrequency = useRef<HTMLDivElement>(null);
  const changeFailureRate = useRef<HTMLDivElement>(null);
  const MeanTimeToRecovery = useRef<HTMLDivElement>(null);

  const mappedData = data.map((currentData) => {
    if (!currentData?.doraMetricsCompleted) {
      return EMPTY_DATA_MAPPER_DORA_CHART('');
    } else {
      return reportMapper(currentData);
    }
  });

  useEffect(() => {
    const LeadTimeForChangeChart = echarts.init(LeadTimeForChange.current);
    const LeadTimeForChangeData = extractedStackedBarData(dateRanges, mappedData);

    const option = LeadTimeForChangeData && stackedBarOptionMapper(LeadTimeForChangeData);
    LeadTimeForChangeChart.setOption(option);
    return () => {
      LeadTimeForChangeChart.dispose();
    };
  }, [LeadTimeForChange, dateRanges, mappedData]);

  useEffect(() => {
    const deploymentFrequencyChart = echarts.init(deploymentFrequency.current);
    const deploymentFrequencyData = extractedDeploymentFrequencyData(dateRanges, mappedData);
    const option = deploymentFrequencyData && oneLineOptionMapper(deploymentFrequencyData);
    deploymentFrequencyChart.setOption(option);
    return () => {
      deploymentFrequencyChart.dispose();
    };
  }, [deploymentFrequency, dateRanges, mappedData]);

  useEffect(() => {
    const changeFailureRateChart = echarts.init(changeFailureRate.current);
    const changeFailureRateData = extractedChangeFailureRateData(dateRanges, mappedData);

    const option = changeFailureRateData && oneLineOptionMapper(changeFailureRateData);
    changeFailureRateChart.setOption(option);
    return () => {
      changeFailureRateChart.dispose();
    };
  }, [changeFailureRate, dateRanges, mappedData]);

  useEffect(() => {
    const MeanTimeToRecoveryChart = echarts.init(MeanTimeToRecovery.current);
    const meanTimeToRecoveryData = extractedMeanTimeToRecoveryDataData(dateRanges, mappedData);
    const option = meanTimeToRecoveryData && oneLineOptionMapper(meanTimeToRecoveryData);
    MeanTimeToRecoveryChart.setOption(option);
    return () => {
      MeanTimeToRecoveryChart.dispose();
    };
  }, [MeanTimeToRecovery, dateRanges, mappedData]);

  return (
    <ChartContainer>
      <ChartWrapper ref={LeadTimeForChange}></ChartWrapper>
      <ChartWrapper ref={deploymentFrequency}></ChartWrapper>
      <ChartWrapper ref={changeFailureRate}></ChartWrapper>
      <ChartWrapper ref={MeanTimeToRecovery}></ChartWrapper>
    </ChartContainer>
  );
};
