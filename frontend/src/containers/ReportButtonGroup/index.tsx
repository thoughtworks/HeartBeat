import { Tooltip } from '@mui/material';
import { TIPS } from '@src/constants/resources';
import { BackButton, SaveButton } from '@src/containers/MetricsStepper/style';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { COMMON_BUTTONS, DOWNLOAD_TYPES } from '@src/constants/commons';
import React, { useEffect } from 'react';
import { CSVReportRequestDTO } from '@src/clients/report/dto/request';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import { ExpiredDialog } from '@src/containers/ReportStep/ExpiredDialog';
import { StyledButtonGroup, StyledExportButton, StyledRightButtonGroup } from '@src/containers/ReportButtonGroup/style';
import { ReportResponseDTO } from '@src/clients/report/dto/response';

interface ReportButtonGroupProps {
  handleSave?: () => void;
  handleBack: () => void;
  csvTimeStamp: number;
  startDate: string;
  endDate: string;
  setErrorMessage: (message: string) => void;
  reportData: ReportResponseDTO | undefined;
  isShowSave: boolean;
  isShowExportBoardButton: boolean;
  isShowExportPipelineButton: boolean;
  isShowExportMetrics: boolean;
}

export const ReportButtonGroup = ({
  handleSave,
  handleBack,
  csvTimeStamp,
  startDate,
  endDate,
  setErrorMessage,
  reportData,
  isShowSave,
  isShowExportMetrics,
  isShowExportBoardButton,
  isShowExportPipelineButton,
}: ReportButtonGroupProps) => {
  const { fetchExportData, errorMessage, isExpired } = useExportCsvEffect();

  useEffect(() => {
    setErrorMessage(errorMessage);
  }, [errorMessage]);

  const exportCSV = (dataType: DOWNLOAD_TYPES, startDate: string, endDate: string): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate,
    endDate: endDate,
  });

  const handleDownload = (dataType: DOWNLOAD_TYPES, startDate: string, endDate: string) => {
    fetchExportData(exportCSV(dataType, startDate, endDate));
  };

  const pipelineButtonDisabled =
    !reportData ||
    reportData.pipelineMetricsCompleted === false ||
    reportData.sourceControlMetricsCompleted === false ||
    reportData?.reportMetricsError?.pipelineMetricsError ||
    reportData?.reportMetricsError?.sourceControlMetricsError;

  const isReportHasError =
    !!reportData?.reportMetricsError.boardMetricsError ||
    !!reportData?.reportMetricsError.pipelineMetricsError ||
    !!reportData?.reportMetricsError.sourceControlMetricsError;

  return (
    <>
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
              disabled={!(reportData?.allMetricsCompleted && !isReportHasError)}
              onClick={() => handleDownload(DOWNLOAD_TYPES.METRICS, startDate, endDate)}
            >
              {COMMON_BUTTONS.EXPORT_METRIC_DATA}
            </StyledExportButton>
          )}
          {isShowExportBoardButton && (
            <StyledExportButton
              disabled={!(reportData?.boardMetricsCompleted && !reportData?.reportMetricsError?.boardMetricsError)}
              onClick={() => handleDownload(DOWNLOAD_TYPES.BOARD, startDate, endDate)}
            >
              {COMMON_BUTTONS.EXPORT_BOARD_DATA}
            </StyledExportButton>
          )}
          {isShowExportPipelineButton && (
            <StyledExportButton
              disabled={!!pipelineButtonDisabled}
              onClick={() => handleDownload(DOWNLOAD_TYPES.PIPELINE, startDate, endDate)}
            >
              {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
            </StyledExportButton>
          )}
        </StyledRightButtonGroup>
      </StyledButtonGroup>
      {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
    </>
  );
};
