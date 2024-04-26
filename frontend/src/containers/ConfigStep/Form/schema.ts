import {
  CALENDAR_TYPE_LITERAL,
  METRICS_LITERAL,
  BOARD_TYPE_LITERAL,
  PIPELINE_TOOL_TYPE_LITERAL,
  SOURCE_CONTROL_TYPE_LITERAL,
  BASIC_INFO_ERROR_MESSAGE,
  BOARD_CONFIG_ERROR_MESSAGE,
  PIPELINE_TOOL_ERROR_MESSAGE,
  SOURCE_CONTROL_ERROR_MESSAGE,
  AGGREGATED_DATE_ERROR_REASON,
} from '@src/containers/ConfigStep/Form/literal';
import { object, string, mixed, InferType, array } from 'yup';
import { REGEX } from '@src/constants/regex';

export const basicInfoSchema = object().shape({
  projectName: string().required(BASIC_INFO_ERROR_MESSAGE.projectName.required),
  dateRange: array()
    .of(
      object().shape({
        startDate: string()
          .nullable()
          .test({
            name: 'CustomStartDateValidation',
            test: function (value, context) {
              if (value === null) {
                return this.createError({
                  path: context.path,
                  message: BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.required,
                });
              }
              if (value === AGGREGATED_DATE_ERROR_REASON) {
                return this.createError({
                  path: context.path,
                  message: BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.invalid,
                });
              } else {
                return true;
              }
            },
          }),
        endDate: string()
          .nullable()
          .test({
            name: 'CustomEndDateValidation',
            test: function (value, context) {
              if (value === null) {
                return this.createError({
                  path: context.path,
                  message: BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.required,
                });
              }
              if (value === AGGREGATED_DATE_ERROR_REASON) {
                return this.createError({
                  path: context.path,
                  message: BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.invalid,
                });
              } else {
                return true;
              }
            },
          }),
      }),
    )
    .required(),
  calendarType: mixed().oneOf(CALENDAR_TYPE_LITERAL),
  metrics: array().of(mixed().oneOf(METRICS_LITERAL)).min(1, BASIC_INFO_ERROR_MESSAGE.metrics.required),
});

export const boardConfigSchema = object().shape({
  type: mixed().oneOf(BOARD_TYPE_LITERAL),
  boardId: string()
    .required(BOARD_CONFIG_ERROR_MESSAGE.boardId.required)
    .matches(REGEX.BOARD_ID, { message: BOARD_CONFIG_ERROR_MESSAGE.boardId.invalid }),
  email: string()
    .required(BOARD_CONFIG_ERROR_MESSAGE.email.required)
    .matches(REGEX.EMAIL, { message: BOARD_CONFIG_ERROR_MESSAGE.email.invalid }),
  site: string().required(BOARD_CONFIG_ERROR_MESSAGE.site.required),
  token: string()
    .required(BOARD_CONFIG_ERROR_MESSAGE.token.invalid)
    .matches(REGEX.BOARD_TOKEN, { message: BOARD_CONFIG_ERROR_MESSAGE.token.invalid }),
});

export const pipelineToolSchema = object().shape({
  type: mixed().oneOf(PIPELINE_TOOL_TYPE_LITERAL),
  token: string()
    .required(PIPELINE_TOOL_ERROR_MESSAGE.token.required)
    .matches(REGEX.BUILDKITE_TOKEN, { message: PIPELINE_TOOL_ERROR_MESSAGE.token.invalid }),
});

export const sourceControlSchema = object().shape({
  type: mixed().oneOf(SOURCE_CONTROL_TYPE_LITERAL),
  token: string()
    .required(SOURCE_CONTROL_ERROR_MESSAGE.token.required)
    .matches(REGEX.GITHUB_TOKEN, { message: SOURCE_CONTROL_ERROR_MESSAGE.token.invalid }),
});

export type IBasicInfoData = InferType<typeof basicInfoSchema>;
export type IBoardConfigData = InferType<typeof boardConfigSchema>;
export type IPipelineToolData = InferType<typeof pipelineToolSchema>;
export type ISourceControlData = InferType<typeof sourceControlSchema>;
