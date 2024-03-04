import { StyledTooltip, TitleAndTooltipContainer, TooltipContainer } from '@src/containers/MetricsStep/CycleTime/style';
import { selectCycleTimeWarningMessage } from '@src/context/Metrics/metricsSlice';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import CycleTimeTable from '@src/containers/MetricsStep/CycleTime/Table';
import FlagCard from '@src/containers/MetricsStep/CycleTime/FlagCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TIPS } from '@src/constants/resources';
import { useAppSelector } from '@src/hooks';
import { IconButton } from '@mui/material';

export const CycleTime = () => {
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage);

  return (
    <div aria-label='Cycle time settings section'>
      <TitleAndTooltipContainer>
        <MetricsSettingTitle title={'Cycle time settings'} />
        <TooltipContainer aria-label='tooltip' data-test-id={'tooltip'}>
          <StyledTooltip arrow title={TIPS.CYCLE_TIME}>
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
  );
};
