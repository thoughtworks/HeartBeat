import {
  selectReworkTimesSettings,
  updateReworkTimesSettings,
  selectCycleTimeSettings,
} from '@src/context/Metrics/metricsSlice';
import { getSortedAndDeduplicationBoardingMapping, onlyEmptyAndDoneState } from '@src/utils/util';
import { ReworkDialog } from '@src/containers/MetricsStep/ReworkSettings/ReworkDialog';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { ReworkHeaderWrapper, ReworkSettingsWrapper } from './style';
import { StyledLink } from '@src/containers/MetricsStep/style';
import { METRICS_CONSTANTS } from '@src/constants/resources';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { SingleSelection } from './SingleSelection';
import React, { useState } from 'react';

function ReworkSettings() {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const reworkTimesSettings = useAppSelector(selectReworkTimesSettings);
  const cycleTimeSettings = useAppSelector(selectCycleTimeSettings);
  const dispatch = useAppDispatch();
  const boardingMappingStatus = getSortedAndDeduplicationBoardingMapping(cycleTimeSettings);
  const boardingMappingHasDoneStatus = boardingMappingStatus.includes(METRICS_CONSTANTS.doneValue);
  const allStateIsEmpty = boardingMappingStatus.every((value) => value === METRICS_CONSTANTS.cycleTimeEmptyStr);
  const isOnlyEmptyAndDoneState = onlyEmptyAndDoneState(boardingMappingStatus);

  const singleOptions = boardingMappingStatus.filter(
    (item) => item !== METRICS_CONSTANTS.doneValue && item !== METRICS_CONSTANTS.cycleTimeEmptyStr,
  );

  const multiOptions = reworkTimesSettings.reworkState
    ? [
        ...singleOptions.slice(singleOptions.indexOf(reworkTimesSettings.reworkState as string) + 1),
        ...(boardingMappingHasDoneStatus ? [METRICS_CONSTANTS.doneValue] : []),
      ]
    : [];

  const isAllSelected = multiOptions.length > 0 && reworkTimesSettings.excludeStates.length === multiOptions.length;

  const handleReworkSettingsChange = (_: React.SyntheticEvent, value: string[]) => {
    let selectValue = value;
    if (value[value.length - 1] === 'All') {
      selectValue = reworkTimesSettings.excludeStates.length === multiOptions.length ? [] : multiOptions;
    }
    dispatch(updateReworkTimesSettings({ ...reworkTimesSettings, excludeStates: selectValue }));
  };

  const showReworkDialog = () => {
    setIsShowDialog(true);
  };

  const hiddenReworkDialog = () => {
    setIsShowDialog(false);
  };

  return (
    <>
      {isShowDialog && <ReworkDialog isShowDialog={isShowDialog} hiddenDialog={hiddenReworkDialog} />}
      <ReworkHeaderWrapper>
        <MetricsSettingTitle title='Rework times settings' />
        <StyledLink onClick={showReworkDialog}>
          <HelpOutlineOutlinedIcon fontSize='small' />
          How to setup
        </StyledLink>
      </ReworkHeaderWrapper>
      {allStateIsEmpty || isOnlyEmptyAndDoneState ? (
        <></>
      ) : (
        <ReworkSettingsWrapper>
          <SingleSelection
            options={singleOptions}
            label={'Rework to which state'}
            value={reworkTimesSettings.reworkState}
            onValueChange={(newValue: string) =>
              dispatch(updateReworkTimesSettings({ excludeStates: [], reworkState: newValue }))
            }
          />
          <MultiAutoComplete
            testId='rework-settings-exclude-selection'
            ariaLabel='Exclude which states (optional)'
            disabled={!reworkTimesSettings.reworkState}
            optionList={multiOptions}
            isError={false}
            isSelectAll={isAllSelected}
            onChangeHandler={handleReworkSettingsChange}
            selectedOption={reworkTimesSettings.excludeStates}
            textFieldLabel={'Exclude which states (optional)'}
            isBoardCrews={false}
          />
        </ReworkSettingsWrapper>
      )}
    </>
  );
}

export default ReworkSettings;
