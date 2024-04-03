import SectionTitleWithTooltip from '@src/components/Common/SectionTitleWithTooltip';
import { selectCycleTimeWarningMessage } from '@src/context/Metrics/metricsSlice';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import CycleTimeTable from '@src/containers/MetricsStep/CycleTime/Table';
import FlagCard from '@src/containers/MetricsStep/CycleTime/FlagCard';
import { TIPS } from '@src/constants/resources';
import { useAppSelector } from '@src/hooks';

export const CycleTime = () => {
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage);

  return (
    <div aria-label='Cycle time settings section'>
      <SectionTitleWithTooltip title='Board mappings' tooltipText={TIPS.CYCLE_TIME} />
      {warningMessage && <WarningNotification message={warningMessage} />}
      <CycleTimeTable />
      <FlagCard />
    </div>
  );
};
