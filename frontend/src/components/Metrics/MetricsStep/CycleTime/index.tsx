import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { selectCycleTimeWarningMessage } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import { TIPS } from '@src/constants/resources'
import {
  StyledTooltip,
  TitleAndTooltipContainer,
  TooltipContainer,
} from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CycleTimeTable from '@src/components/Metrics/MetricsStep/CycleTime/Table'

export const CycleTime = () => {
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage)

  return (
    <div aria-label='Cycle time settings section'>
      <TitleAndTooltipContainer>
        <MetricsSettingTitle title={'Cycle time settings'} />
        <TooltipContainer data-test-id={'tooltip'}>
          <StyledTooltip title={TIPS.CYCLE_TIME}>
            <IconButton aria-label='info'>
              <InfoOutlinedIcon />
            </IconButton>
          </StyledTooltip>
        </TooltipContainer>
      </TitleAndTooltipContainer>
      {warningMessage && <WarningNotification message={warningMessage} />}
      <CycleTimeTable />
      <FlagCard />
    </div>
  )
}
