import { saveTargetFields, selectClassificationWarningMessage } from '@src/context/Metrics/metricsSlice';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import React, { useState } from 'react';

interface classificationProps {
  title: string;
  label: string;
  targetFields: { name: string; key: string; flag: boolean }[];
}

export const Classification = ({ targetFields, title, label }: classificationProps) => {
  const dispatch = useAppDispatch();
  const classificationWarningMessage = useAppSelector(selectClassificationWarningMessage);
  const classificationSettings = targetFields
    .filter((targetField) => targetField.flag)
    .map((targetField) => targetField.name);
  const [selectedClassification, setSelectedClassification] = useState<string[]>(classificationSettings);
  const isAllSelected = selectedClassification.length > 0 && selectedClassification.length === targetFields.length;

  const handleChange = (event: React.SyntheticEvent, value: string[]) => {
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
    setSelectedClassification(newClassificationSettings);
    dispatch(saveTargetFields(updatedTargetFields));
  };

  return (
    <>
      <MetricsSettingTitle title={title} />
      {classificationWarningMessage && <WarningNotification message={classificationWarningMessage} />}
      <MultiAutoComplete
        optionList={targetFields.map((targetField) => targetField.name)}
        selectedOption={selectedClassification}
        textFieldLabel={label}
        isError={false}
        onChangeHandler={handleChange}
        isSelectAll={isAllSelected}
      />
    </>
  );
};
