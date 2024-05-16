import { StyledButtonGroup, StyledExportButton, StyledRightButtonGroup } from '@src/containers/ReportButtonGroup/style';
import { COMMON_BUTTONS, DOWNLOAD_DIALOG_TITLE, REPORT_TYPES } from '@src/constants/commons';
import { DateRangeItem, DownloadDialog } from '@src/containers/ReportStep/DownloadDialog';
import { BackButton, SaveButton } from '@src/containers/MetricsStepper/style';
import { ExpiredDialog } from '@src/containers/ReportStep/ExpiredDialog';
import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { AllErrorResponse } from '@src/clients/report/dto/response';
import { DateRangeRequestResult } from '@src/containers/ReportStep';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { TIPS } from '@src/constants/resources';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

interface ReportButtonGroupProps {
  handleSave?: () => void;
  handleBack: () => void;
  csvTimeStamp: number;
  isShowSave: boolean;
  isShowExportBoardButton: boolean;
  isShowExportPipelineButton: boolean;
  isShowExportMetrics: boolean;
  dateRangeRequestResults: DateRangeRequestResult[];
  isShowExportDoraChartButton: boolean;
  isShowExportBoardChartButton: boolean;
}

export const ReportButtonGroup = ({
  handleSave,
  handleBack,
  csvTimeStamp,
  isShowSave,
  isShowExportMetrics,
  isShowExportBoardButton,
  isShowExportPipelineButton,
  isShowExportDoraChartButton,
  isShowExportBoardChartButton,
  dateRangeRequestResults,
}: ReportButtonGroupProps) => {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [downloadReportList, setDownloadReportList] = useState<DateRangeItem[]>([]);
  const [dataType, setDataType] = useState<REPORT_TYPES | null>(null);
  const { fetchExportData, isExpired } = useExportCsvEffect();

  const isReportHasError = (reportMetricsError: AllErrorResponse) => {
    return (
      !!reportMetricsError.boardMetricsError ||
      !!reportMetricsError.pipelineMetricsError ||
      !!reportMetricsError.sourceControlMetricsError
    );
  };

  const isReportHasDoraError = (reportMetricsError: AllErrorResponse) => {
    return !!reportMetricsError.pipelineMetricsError || !!reportMetricsError.sourceControlMetricsError;
  };

  const overallMetricsResults = dateRangeRequestResults.map((item) => ({
    startDate: item.startDate,
    endDate: item.endDate,
    disabled: !(item.overallMetricsCompleted && !isReportHasError(item.reportMetricsError)),
  }));
  const boardMetricsResults = dateRangeRequestResults.map((item) => ({
    startDate: item.startDate,
    endDate: item.endDate,
    disabled: !(item.boardMetricsCompleted && !item.reportMetricsError.boardMetricsError),
  }));
  const pipelineMetricsResults = dateRangeRequestResults.map((item) => ({
    startDate: item.startDate,
    endDate: item.endDate,
    disabled: !(item.doraMetricsCompleted && !isReportHasDoraError(item.reportMetricsError)),
  }));

  const isExportMetricsButtonClickable =
    dateRangeRequestResults.every(({ overallMetricsCompleted }) => overallMetricsCompleted) &&
    overallMetricsResults.some(({ disabled }) => !disabled);
  const isExportBoardButtonClickable =
    dateRangeRequestResults.every(({ boardMetricsCompleted }) => boardMetricsCompleted) &&
    boardMetricsResults.some(({ disabled }) => !disabled);
  const isExportPipelineButtonClickable =
    dateRangeRequestResults.every(({ doraMetricsCompleted }) => doraMetricsCompleted) &&
    pipelineMetricsResults.some(({ disabled }) => !disabled);

  const exportCSV = (dataType: REPORT_TYPES, startDate: string, endDate: string): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate,
    endDate: endDate,
  });

  const handleDownload = (dateRange: DateRangeItem[], dataType: REPORT_TYPES) => {
    if (dateRange.length > 1) {
      setDownloadReportList(dateRange);
      setDataType(dataType);
      setIsShowDialog(true);
    } else {
      fetchExportData(exportCSV(dataType, dateRange[0].startDate, dateRange[0].endDate));
    }
  };

  const handleCloseDialog = () => {
    setIsShowDialog(false);
    setDataType(null);
  };

  return (
    <>
      {dataType && (
        <DownloadDialog
          isShowDialog={isShowDialog}
          handleClose={handleCloseDialog}
          dateRangeList={downloadReportList}
          downloadCSVFile={(startDate, endDate) => fetchExportData(exportCSV(dataType, startDate, endDate))}
          title={DOWNLOAD_DIALOG_TITLE[dataType]}
        />
      )}
      <StyledButtonGroup isShowSave={isShowSave}>
        {isShowSave && (
          <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
            <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
              {COMMON_BUTTONS.SAVE}
            </SaveButton>
          </Tooltip>
        )}
        <StyledRightButtonGroup>
          <BackButton onClick={handleBack} variant='outlined'>
            {COMMON_BUTTONS.BACK}
          </BackButton>
          {isShowExportMetrics && (
            <StyledExportButton
              disabled={!isExportMetricsButtonClickable}
              onClick={() => handleDownload(overallMetricsResults, REPORT_TYPES.METRICS)}
            >
              {COMMON_BUTTONS.EXPORT_METRIC_DATA}
            </StyledExportButton>
          )}
          {isShowExportBoardButton && (
            <StyledExportButton
              disabled={!isExportBoardButtonClickable}
              onClick={() => handleDownload(boardMetricsResults, REPORT_TYPES.BOARD)}
            >
              {COMMON_BUTTONS.EXPORT_BOARD_DATA}
            </StyledExportButton>
          )}
          {isShowExportPipelineButton && (
            <StyledExportButton
              disabled={!isExportPipelineButtonClickable}
              onClick={() => handleDownload(pipelineMetricsResults, REPORT_TYPES.PIPELINE)}
            >
              {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
            </StyledExportButton>
          )}
          {(isShowExportDoraChartButton || isShowExportBoardChartButton) && (
            <StyledExportButton disabled={!isExportPipelineButtonClickable || !isExportBoardButtonClickable}>
              {isShowExportDoraChartButton && COMMON_BUTTONS.EXPORT_DORA_CHART}
            </StyledExportButton>
          )}
        </StyledRightButtonGroup>
      </StyledButtonGroup>
      {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
    </>
  );
};
