import { TypedStyledAutocompleted, ITargetFieldType } from '@src/components/Common/MultiAutoComplete/styles';
import { saveTargetFields, selectClassificationWarningMessage } from '@src/context/Metrics/metricsSlice';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { Checkbox, createFilterOptions, TextField } from '@mui/material';
import { formatDuplicatedNameWithSuffix } from '@src/utils/util';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { ALL_OPTION_META } from '@src/constants/resources';
import { Z_INDEX } from '@src/constants/commons';
import { useAppSelector } from '@src/hooks';
import React from 'react';

export interface classificationProps {
  title: string;
  label: string;
  targetFields: ITargetFieldType[];
}

export const Classification = ({ targetFields, title, label }: classificationProps) => {
  const dispatch = useAppDispatch();
  const targetFieldsWithSuffix = formatDuplicatedNameWithSuffix(targetFields);
  const classificationWarningMessage = useAppSelector(selectClassificationWarningMessage);
  const selectedOptions = targetFieldsWithSuffix.filter(({ flag }) => flag);
  const isAllSelected = selectedOptions.length > 0 && selectedOptions.length === targetFieldsWithSuffix.length;

  const handleChange = (_: React.SyntheticEvent, value: ITargetFieldType[]) => {
    let nextSelectedOptions: ITargetFieldType[];
    if (value.length === 0) {
      nextSelectedOptions = [];
    } else {
      nextSelectedOptions =
        value[value.length - 1].key === 'all' ? (isAllSelected ? [] : targetFieldsWithSuffix) : value;
    }
    const updatedTargetFields = targetFields.map((targetField) => ({
      ...targetField,
      flag: !!nextSelectedOptions.find((option) => option.key === targetField.key),
    }));
    dispatch(saveTargetFields(updatedTargetFields));
  };

  return (
    <>
      <MetricsSettingTitle title={title} />
      {classificationWarningMessage && <WarningNotification message={classificationWarningMessage} />}
      <TypedStyledAutocompleted
        aria-label='Classification Setting AutoComplete'
        multiple
        options={targetFieldsWithSuffix}
        disableCloseOnSelect
        value={selectedOptions}
        filterOptions={(options, params): ITargetFieldType[] => {
          const filtered = createFilterOptions<ITargetFieldType>()(options, params);
          const allOption = {
            flag: isAllSelected,
            name: ALL_OPTION_META.label,
            key: ALL_OPTION_META.key,
          };
          return [allOption, ...filtered];
        }}
        getOptionLabel={(option) => option.name}
        onChange={(event, value) => handleChange(event, value as ITargetFieldType[])}
        renderOption={(props, option: ITargetFieldType, state) => {
          const selectAllProps = option.key === 'all' ? { checked: isAllSelected } : {};
          return (
            <li {...props} data-testid={option.key}>
              <Checkbox style={{ marginRight: '0.5rem' }} checked={state.selected} {...selectAllProps} />
              {option.name as string}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} required={true} error={false} variant='standard' label={label} />
        )}
        slotProps={{
          popper: {
            sx: {
              zIndex: Z_INDEX.DROPDOWN,
            },
          },
        }}
      />
    </>
  );
};
