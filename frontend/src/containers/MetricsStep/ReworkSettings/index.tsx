import { selectReworkTimesSettings, updateReworkTimesSettings } from '@src/context/Metrics/metricsSlice';
import { ReworkDialog } from '@src/containers/MetricsStep/ReworkSettings/ReworkDialog';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { METRICS_CONSTANTS, REWORK_TIME_LIST } from '@src/constants/resources';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { ReworkHeaderWrapper, ReworkSettingsWrapper } from './style';
import { StyledLink } from '@src/containers/MetricsStep/style';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { SingleSelection } from './SingleSelection';
import React, { useState } from 'react';

function ReworkSettings() {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const reworkTimesSettings = useAppSelector(selectReworkTimesSettings);
  const dispatch = useAppDispatch();

  const MultiOptions = reworkTimesSettings.rework2State
    ? [
        ...REWORK_TIME_LIST.slice(REWORK_TIME_LIST.indexOf(reworkTimesSettings.rework2State) + 1),
        METRICS_CONSTANTS.doneValue,
      ]
    : [];

  const isAllSelected = MultiOptions.length > 0 && reworkTimesSettings.excludeStates.length === MultiOptions.length;

  const handleReworkSettingsChange = (_: React.SyntheticEvent, value: string[]) => {
    let selectValue = value;
    if (value[value.length - 1] === 'All') {
      selectValue = reworkTimesSettings.excludeStates.length === MultiOptions.length ? [] : MultiOptions;
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
      <ReworkSettingsWrapper>
        <SingleSelection
          options={REWORK_TIME_LIST}
          label={'Rework to which state'}
          value={reworkTimesSettings.rework2State}
          onValueChange={(newValue: string) =>
            dispatch(updateReworkTimesSettings({ excludeStates: [], rework2State: newValue }))
          }
        />
        <MultiAutoComplete
          testId='rework-settings-exclude-selection'
          ariaLabel='Exclude which states (optional)'
          disabled={!reworkTimesSettings.rework2State}
          optionList={MultiOptions}
          isError={false}
          isSelectAll={isAllSelected}
          onChangeHandler={handleReworkSettingsChange}
          selectedOption={reworkTimesSettings.excludeStates}
          textFieldLabel={'Exclude which states (optional)'}
          isBoardCrews={false}
        />
      </ReworkSettingsWrapper>
    </>
  );
}

export default ReworkSettings;
