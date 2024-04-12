import {
  selectCycleTimeWarningMessage,
  selectDisplayFlagCardDropWarning,
  selectMetricsContent,
  selectTreatFlagCardAsBlock,
  updateDisplayFlagCardDropWarning,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import SectionTitleWithTooltip from '@src/components/Common/SectionTitleWithTooltip';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import CycleTimeTable from '@src/containers/MetricsStep/CycleTime/Table';
import FlagCard from '@src/containers/MetricsStep/CycleTime/FlagCard';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { MESSAGE, TIPS } from '@src/constants/resources';
import { useEffect, useMemo, useState } from 'react';
import { existBlockColumn } from '@src/utils/util';
import { useAppSelector } from '@src/hooks';

export const CycleTime = () => {
  const dispatch = useAppDispatch();
  const flagCardAsBlock = useAppSelector(selectTreatFlagCardAsBlock);
  const displayFlagCardDropWarning = useAppSelector(selectDisplayFlagCardDropWarning);
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage);
  const { cycleTimeSettings, cycleTimeSettingsType } = useAppSelector(selectMetricsContent);
  const hasBlockColumn = useMemo(() => {
    return existBlockColumn(cycleTimeSettingsType, cycleTimeSettings);
  }, [cycleTimeSettingsType, cycleTimeSettings]);
  const [shouldShowConflictMessage, setShouldShowConflictMessage] = useState(false);

  useEffect(() => {
    if (hasBlockColumn && displayFlagCardDropWarning) {
      setShouldShowConflictMessage(true);
      dispatch(updateDisplayFlagCardDropWarning(false));
    }

    if (hasBlockColumn && flagCardAsBlock) {
      dispatch(updateTreatFlagCardAsBlock(false));
    }
  }, [dispatch, flagCardAsBlock, displayFlagCardDropWarning, hasBlockColumn]);

  return (
    <div aria-label='Cycle time settings section'>
      {shouldShowConflictMessage && <WarningNotification message={MESSAGE.FLAG_CARD_DROPPED_WARNING} />}
      <SectionTitleWithTooltip title='Board mappings' tooltipText={TIPS.CYCLE_TIME} />
      {warningMessage && <WarningNotification message={warningMessage} />}
      <CycleTimeTable />
      {hasBlockColumn || <FlagCard />}
    </div>
  );
};
