import { saveTargetFields, selectClassificationWarningMessage } from '@src/context/Metrics/metricsSlice';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import React, { useMemo } from 'react';

export interface TargetFieldType {
  name: string;
  key: string;
  flag: boolean;
}
export interface classificationProps {
  title: string;
  label: string;
  targetFields: TargetFieldType[];
}

export const Classification = ({ targetFields, title, label }: classificationProps) => {
  const dispatch = useAppDispatch();
  const classificationWarningMessage = useAppSelector(selectClassificationWarningMessage);
  const options = targetFields.map(({ name }) => name);
  const classificationSettings = targetFields.filter(({ flag }) => flag).map(({ name }) => name);
  const isAllSelected = useMemo(() => {
    return classificationSettings.length > 0 && classificationSettings.length === targetFields.length;
  }, [classificationSettings, targetFields.length]);

  const handleChange = (_: React.SyntheticEvent, value: string[]) => {
    const newClassificationSettings =
      value[value.length - 1] === 'All'
        ? isAllSelected
          ? []
          : targetFields.map((targetField) => targetField.name)
        : [...value];
    const updatedTargetFields = targetFields.map((targetField) => ({
      ...targetField,
      flag: newClassificationSettings.includes(targetField.name),
    }));
    dispatch(saveTargetFields(updatedTargetFields));
  };

  return (
    <>
      <MetricsSettingTitle title={title} />
      {classificationWarningMessage && <WarningNotification message={classificationWarningMessage} />}
      <MultiAutoComplete
        optionList={options}
        selectedOption={classificationSettings}
        textFieldLabel={label}
        isError={false}
        onChangeHandler={handleChange}
        isSelectAll={isAllSelected}
      />
    </>
  );
};
