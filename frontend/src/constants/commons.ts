import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';

export const PROJECT_NAME = 'Heartbeat';

export const DEFAULT_HELPER_TEXT = '';

export const FIVE_HUNDRED = 500;

export const ZERO = 0;

export const EMPTY_STRING = '';

export const STEPS = ['Config', 'Metrics', 'Report'];

export const SELECTED_VALUE_SEPARATOR = ', ';

export const DURATION = {
  ERROR_MESSAGE_TIME: 4000,
  NOTIFICATION_TIME: 10000,
};

export const INIT_REPORT_DATA_WITH_TWO_COLUMNS: ReportDataWithTwoColumns[] = [
  {
    id: 1,
    name: '',
    valueList: [{ value: 0, unit: '' }],
  },
];

export const INIT_REPORT_DATA_WITH_THREE_COLUMNS: ReportDataWithThreeColumns[] = [
  {
    id: 1,
    name: '',
    valuesList: [
      {
        name: '',
        value: '',
      },
    ],
  },
];

export const Z_INDEX = {
  DEFAULT: 0,
  BUTTONS: 1,
  INPUTS: 2,
  INPUT_GROUPS: 3,
  DROPDOWN: 1025,
  SNACKBARS: 1010,
  MODAL_BACKDROP: 1020,
  MODAL: 1030,
  POPOVER: 1040,
  TOOLTIP: 1050,
  STICKY: 1060,
  FIXED: 1070,
};

export enum REPORT_TYPES {
  METRICS = 'metric',
  BOARD = 'board',
  PIPELINE = 'pipeline',
}

export enum METRIC_TYPES {
  BOARD = 'board',
  DORA = 'dora',
}

export const METRICS_STEPS = {
  CONFIG: 0,
  METRICS: 1,
  REPORT: 2,
};

export const COMMON_BUTTONS = {
  SAVE: 'Save',
  BACK: 'Previous',
  NEXT: 'Next',
  EXPORT_PIPELINE_DATA: 'Export pipeline data',
  EXPORT_BOARD_DATA: 'Export board data',
  EXPORT_METRIC_DATA: 'Export metric data',
};

export const GRID_CONFIG = {
  HALF: { XS: 6, MAX_INDEX: 2, FLEX: 1 },
  FULL: { XS: 12, MAX_INDEX: 4, FLEX: 0.25 },
};
