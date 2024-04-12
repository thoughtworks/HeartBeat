import {
  BLOCK_COLUMN_NAME,
  CYCLE_TIME_LIST,
  CYCLE_TIME_SETTINGS_TYPES,
  METRICS_CONSTANTS,
} from '@src/constants/resources';
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/constants/emojis/emoji';
import { ICycleTimeSetting, IPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { ITargetFieldType } from '@src/components/Common/MultiAutoComplete/styles';
import { DATE_FORMAT_TEMPLATE } from '@src/constants/template';
import { TDateRange } from '@src/context/config/configSlice';
import { includes, isEqual, sortBy } from 'lodash';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(duration);

export const exportToJsonFile = (filename: string, json: object) => {
  const dataStr = JSON.stringify(json, null, 4);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  const exportFileDefaultName = `${filename}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const downloadCSV = (filename: string, data: string) => {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const transformToCleanedBuildKiteEmoji = (input: OriginBuildKiteEmoji[]): CleanedBuildKiteEmoji[] =>
  input.map(({ name, image, aliases }) => ({
    image,
    aliases: [...new Set([...aliases, name])],
  }));

export const getJiraBoardToken = (token: string, email: string) => {
  if (!token) return '';
  const encodedMsg = btoa(`${email}:${token}`);

  return `Basic ${encodedMsg}`;
};

export const filterAndMapCycleTimeSettings = (cycleTimeSettings: ICycleTimeSetting[]) =>
  cycleTimeSettings
    .filter((item) => item.value !== METRICS_CONSTANTS.cycleTimeEmptyStr)
    .map(({ status, value }) => ({
      name: status,
      value,
    }));

export const getRealDoneStatus = (
  cycleTimeSettings: ICycleTimeSetting[],
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES,
  realDoneStatus: string[],
) => {
  const selectedDoneStatus = cycleTimeSettings
    .filter(({ value }) => value === METRICS_CONSTANTS.doneValue)
    .map(({ status }) => status);
  if (selectedDoneStatus.length <= 1) {
    return selectedDoneStatus;
  }
  return cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN
    ? realDoneStatus
    : cycleTimeSettings.filter(({ value }) => value === METRICS_CONSTANTS.doneValue).map(({ status }) => status);
};

export const findCaseInsensitiveType = (option: string[], value: string): string => {
  const newValue = option.find((item) => value.toLowerCase() === item.toLowerCase());
  return newValue ? newValue : value;
};

export const getDisabledOptions = (deploymentFrequencySettings: IPipelineConfig[], option: string) => {
  return includes(
    deploymentFrequencySettings.map((item) => item.pipelineName),
    option,
  );
};

export const sortDisabledOptions = (deploymentFrequencySettings: IPipelineConfig[], options: string[]) => {
  return sortBy(options, (item: string) => getDisabledOptions(deploymentFrequencySettings, item));
};

export const formatDate = (date: Date | string) => {
  return dayjs(date).format(DATE_FORMAT_TEMPLATE);
};

export const formatMinToHours = (duration: number) => {
  return dayjs.duration(duration, 'minutes').asHours();
};

export const formatMillisecondsToHours = (duration: number) => {
  return dayjs.duration(duration, 'milliseconds').asHours();
};

export const formatDateToTimestampString = (date: string) => {
  return dayjs(date).valueOf().toString();
};

export const sortDateRanges = (dateRanges: TDateRange, descending = true) => {
  const result = [...dateRanges].sort((a, b) => {
    return dayjs(b.startDate as string).diff(dayjs(a.startDate as string));
  });
  return descending ? result : result.reverse();
};

export const formatDuplicatedNameWithSuffix = (data: ITargetFieldType[]) => {
  const nameSumMap = new Map<string, number>();
  const nameCountMap = new Map<string, number>();
  data.forEach((item) => {
    const name = item.name;
    const count = nameCountMap.get(item.name) || 0;
    nameSumMap.set(name, count + 1);
    nameCountMap.set(name, count + 1);
  });
  return data.map((item) => {
    const newItem = { ...item };
    const name = newItem.name;
    const count = nameCountMap.get(name) as number;
    const maxCount = nameSumMap.get(name) as number;
    if (maxCount > 1) {
      newItem.name = `${name}-${maxCount - count + 1}`;
      nameCountMap.set(name, count - 1);
    }
    return newItem;
  });
};

export const getSortedAndDeduplicationBoardingMapping = (boardMapping: ICycleTimeSetting[]) => {
  return [...new Set(boardMapping.map((item) => item.value))].sort((a, b) => {
    return CYCLE_TIME_LIST.indexOf(a) - CYCLE_TIME_LIST.indexOf(b);
  });
};

export const onlyEmptyAndDoneState = (boardingMappingStates: string[]) =>
  isEqual(boardingMappingStates, [METRICS_CONSTANTS.doneValue]) ||
  isEqual(boardingMappingStates, [METRICS_CONSTANTS.cycleTimeEmptyStr, METRICS_CONSTANTS.doneValue]) ||
  isEqual(boardingMappingStates, [METRICS_CONSTANTS.doneValue, METRICS_CONSTANTS.cycleTimeEmptyStr]);

export function convertCycleTimeSettings(
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES,
  cycleTimeSettings: ICycleTimeSetting[],
) {
  if (cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN) {
    return ([...new Set(cycleTimeSettings.map(({ column }: ICycleTimeSetting) => column))] as string[]).map(
      (uniqueColumn) => ({
        [uniqueColumn]:
          cycleTimeSettings.find(({ column }: ICycleTimeSetting) => column === uniqueColumn)?.value ||
          METRICS_CONSTANTS.cycleTimeEmptyStr,
      }),
    );
  }
  return cycleTimeSettings?.map(({ status, value }: ICycleTimeSetting) => ({ [status]: value }));
}

export function existBlockColumn(
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES,
  cycleTimeSettings: ICycleTimeSetting[],
) {
  return cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN
    ? cycleTimeSettings.some(({ column }) => BLOCK_COLUMN_NAME.includes(column.toUpperCase()))
    : cycleTimeSettings.some(({ status }) => BLOCK_COLUMN_NAME.includes(status.toUpperCase()));
}
