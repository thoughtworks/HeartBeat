import {
  selectTreatFlagCardAsBlock,
  updateTreatFlagCardAsBlock,
  updateMetricsBoardDirtyStatus,
} from '@src/context/Metrics/metricsSlice';
import { FlagCardItem, ItemCheckbox, ItemText } from '@src/containers/MetricsStep/CycleTime/style';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import React from 'react';

const FlagCard = () => {
  const dispatch = useAppDispatch();
  const flagCardAsBlock = useAppSelector(selectTreatFlagCardAsBlock);

  const handleFlagCardAsBlock = () => {
    dispatch(updateTreatFlagCardAsBlock(!flagCardAsBlock));
    dispatch(updateMetricsBoardDirtyStatus(true));
  };

  return (
    <FlagCardItem onClick={handleFlagCardAsBlock}>
      <ItemCheckbox checked={flagCardAsBlock} />
      <ItemText>Consider the &quot;Flag&quot; as &quot;Block&quot;</ItemText>
    </FlagCardItem>
  );
};

export default FlagCard;
