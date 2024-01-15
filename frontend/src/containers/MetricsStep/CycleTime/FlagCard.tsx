import React from 'react';
import { FlagCardItem, ItemCheckbox, ItemText } from '@src/containers/MetricsStep/CycleTime/style';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { selectTreatFlagCardAsBlock, updateTreatFlagCardAsBlock } from '@src/context/Metrics/metricsSlice';
import { useAppSelector } from '@src/hooks';

const FlagCard = () => {
  const dispatch = useAppDispatch();
  const flagCardAsBlock = useAppSelector(selectTreatFlagCardAsBlock);

  const handleFlagCardAsBlock = () => {
    dispatch(updateTreatFlagCardAsBlock(!flagCardAsBlock));
  };

  return (
    <FlagCardItem onClick={handleFlagCardAsBlock}>
      <ItemCheckbox checked={flagCardAsBlock} />
      <ItemText>Consider the &quot;Flag&quot; as &quot;Block&quot;</ItemText>
    </FlagCardItem>
  );
};

export default FlagCard;
