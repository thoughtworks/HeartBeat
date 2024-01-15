import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import FlagCard from '@src/containers/MetricsStep/CycleTime/FlagCard';
import { selectCycleTimeWarningMessage } from '@src/context/Metrics/metricsSlice';
import { useAppSelector } from '@src/hooks';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { TIPS } from '@src/constants/resources';
import {
  StyledTooltip,
  TitleAndTooltipContainer,
  TooltipContainer,
} from '@src/containers/MetricsStep/CycleTime/style';
import { IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CycleTimeTable from '@src/containers/MetricsStep/CycleTime/Table';

export const CycleTime = () => {
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage);

  return (
    <div aria-label='Cycle time settings section'>
      <TitleAndTooltipContainer>
        <MetricsSettingTitle title={'Cycle time settings'} />
        <TooltipContainer data-test-id={'tooltip'}>
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
