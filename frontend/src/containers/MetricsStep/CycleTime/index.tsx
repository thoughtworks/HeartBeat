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
import { existBlockState } from '@src/utils/util';
import { useAppSelector } from '@src/hooks';

export const CycleTime = () => {
  const dispatch = useAppDispatch();
  const flagCardAsBlock = useAppSelector(selectTreatFlagCardAsBlock);
  const displayFlagCardDropWarning = useAppSelector(selectDisplayFlagCardDropWarning);
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage);
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent);
  const hasBlockState = useMemo(() => {
    return existBlockState(cycleTimeSettings);
  }, [cycleTimeSettings]);
  const [shouldShowConflictMessage, setShouldShowConflictMessage] = useState(false);

  useEffect(() => {
    if (hasBlockState && displayFlagCardDropWarning) {
      setShouldShowConflictMessage(true);
      dispatch(updateDisplayFlagCardDropWarning(false));
    }
    if (hasBlockState && flagCardAsBlock) {
      dispatch(updateTreatFlagCardAsBlock(false));
    }
  }, [dispatch, flagCardAsBlock, displayFlagCardDropWarning, hasBlockState]);

  return (
    <div aria-label='Cycle time settings section'>
      {shouldShowConflictMessage && <WarningNotification message={MESSAGE.FLAG_CARD_DROPPED_WARNING} />}
      <SectionTitleWithTooltip title='Board mappings' tooltipText={TIPS.CYCLE_TIME} />
      {warningMessage && <WarningNotification message={warningMessage} />}
      <CycleTimeTable />
      {hasBlockState || <FlagCard />}
    </div>
  );
};
