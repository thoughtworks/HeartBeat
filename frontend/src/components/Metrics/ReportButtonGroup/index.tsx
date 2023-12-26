import { Tooltip } from '@mui/material'
import { REQUIRED_DATA, TIPS } from '@src/constants/resources'
import { BackButton, SaveButton } from '@src/components/Metrics/MetricsStepper/style'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { COMMON_BUTTONS, DOWNLOAD_TYPES } from '@src/constants/commons'
import React, { useEffect } from 'react'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { backStep } from '@src/context/stepper/StepperSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'
import { useAppSelector } from '@src/hooks'
import { selectMetrics } from '@src/context/config/configSlice'
import { ExpiredDialog } from '@src/components/Metrics/ReportStep/ExpiredDialog'
import { StyledButtonGroup, StyledExportButton } from '@src/components/Metrics/ReportButtonGroup/style'
import { ReportResponseDTO } from '@src/clients/report/dto/response'

interface ReportButtonGroupProps {
  handleSave: () => void
  csvTimeStamp: number
  startDate: string | null
  endDate: string | null
  setErrorMessage: (message: string) => void
  shouldShowBoardExportButton: boolean
  reportData: ReportResponseDTO | undefined
}

export const ReportButtonGroup = ({
  handleSave,
  csvTimeStamp,
  startDate,
  endDate,
  setErrorMessage,
  reportData,
  shouldShowBoardExportButton,
}: ReportButtonGroupProps) => {
  const dispatch = useAppDispatch()
  const { fetchExportData, errorMessage, isExpired } = useExportCsvEffect()
  const requiredData = useAppSelector(selectMetrics)
  const isShowExportPipelineButton =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)

  useEffect(() => {
    setErrorMessage(errorMessage)
  }, [errorMessage])

  const getExportCSV = (
    dataType: DOWNLOAD_TYPES,
    startDate: string | null,
    endDate: string | null
  ): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate ?? '',
    endDate: endDate ?? '',
  })

  const handleDownload = (dataType: DOWNLOAD_TYPES, startDate: string | null, endDate: string | null) => {
    fetchExportData(getExportCSV(dataType, startDate, endDate))
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  return (
    <>
      <StyledButtonGroup>
        <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
          <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
            {COMMON_BUTTONS.SAVE}
          </SaveButton>
        </Tooltip>
        <div>
          <BackButton onClick={handleBack} variant='outlined'>
            {COMMON_BUTTONS.BACK}
          </BackButton>
          <StyledExportButton
            disabled={!reportData?.allMetricsReady}
            onClick={() => handleDownload(DOWNLOAD_TYPES.METRICS, startDate, endDate)}
          >
            {COMMON_BUTTONS.EXPORT_METRIC_DATA}
          </StyledExportButton>
          {shouldShowBoardExportButton && (
            <StyledExportButton
              disabled={!reportData?.boardMetricsReady}
              onClick={() => handleDownload(DOWNLOAD_TYPES.BOARD, startDate, endDate)}
            >
              {COMMON_BUTTONS.EXPORT_BOARD_DATA}
            </StyledExportButton>
          )}
          {isShowExportPipelineButton && (
            <StyledExportButton
              disabled={!reportData?.pipelineMetricsReady || !reportData?.sourceControlMetricsReady}
              onClick={() => handleDownload(DOWNLOAD_TYPES.PIPELINE, startDate, endDate)}
            >
              {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
            </StyledExportButton>
          )}
        </div>
      </StyledButtonGroup>
      {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
    </>
  )
}
