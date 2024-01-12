import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { DEFAULT_HELPER_TEXT, EMPTY_STRING, ZERO } from '@src/constants/commons';
import { CONFIG_TITLE, PIPELINE_TOOL_TYPES, TOKEN_HELPER_TEXT } from '@src/constants/resources';
import { FormEvent, useEffect, useState } from 'react';
import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import {
  isPipelineToolVerified,
  selectDateRange,
  selectPipelineTool,
  updatePipelineTool,
  updatePipelineToolVerifyState,
} from '@src/context/config/configSlice';
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect';
import { Loading } from '@src/components/Loading';
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons';
import { initDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { findCaseInsensitiveType } from '@src/utils/util';
import { REGEX } from '@src/constants/regex';

export const PipelineTool = () => {
  const dispatch = useAppDispatch();
  const pipelineToolFields = useAppSelector(selectPipelineTool);
  const DateRange = useAppSelector(selectDateRange);
  const isVerified = useAppSelector(isPipelineToolVerified);
  const { verifyPipelineTool, isLoading, errorMessage, clearErrorMessage } = useVerifyPipelineToolEffect();
  const type = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), pipelineToolFields.type);
  const [fields, setFields] = useState([
    {
      key: 'PipelineTool',
      value: type,
      isValid: true,
      isRequired: true,
    },
    {
      key: 'Token',
      value: pipelineToolFields.token,
      isValid: true,
      isRequired: true,
    },
  ]);
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(!(fields[1].isValid && fields[1].value));

  const initPipeLineFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = !index ? PIPELINE_TOOL_TYPES.BUILD_KITE : EMPTY_STRING;
      return field;
    });
    setFields(newFields);
    dispatch(updatePipelineToolVerifyState(false));
  };

  useEffect(() => {
    const isFieldValid = (field: { key: string; value: string; isRequired: boolean; isValid: boolean }) =>
      field.isRequired && field.isValid && !!field.value;

    const isAllFieldsValid = (fields: { key: string; value: string; isRequired: boolean; isValid: boolean }[]) =>
      fields.every((field) => isFieldValid(field));
    setIsDisableVerifyButton(!isAllFieldsValid(fields));
  }, [fields]);

  useEffect(() => {
    if (errorMessage) {
      const newFields = fields.map((field, index) => (index ? { ...field, isValid: false } : { ...field }));
      setFields(newFields);
    }
  }, [errorMessage]);

  const onFormUpdate = (index: number, value: string) => {
    clearErrorMessage();
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (!index) {
        field.value = !fieldIndex ? value : EMPTY_STRING;
      } else if (!!index && !!fieldIndex) {
        return {
          ...field,
          value,
          isRequired: !!value,
          isValid: REGEX.BUILDKITE_TOKEN.test(value),
        };
      }
      return field;
    });
    setFields(newFieldsValue);
    dispatch(updatePipelineToolVerifyState(false));
    dispatch(
      updatePipelineTool({
        type: fields[0].value,
        token: fields[1].value,
      })
    );
  };

  const updateFieldHelpText = () => {
    const { isRequired, isValid } = fields[1];
    if (!isRequired) {
      return TOKEN_HELPER_TEXT.RequiredTokenText;
    }
    if (!isValid) {
      if (!errorMessage) {
        return TOKEN_HELPER_TEXT.InvalidTokenText;
      }
      return errorMessage;
    }
    return DEFAULT_HELPER_TEXT;
  };

  const updatePipelineToolFields = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updatePipelineTool({
        type: fields[0].value,
        token: fields[1].value,
      })
    );
  };

  const handleSubmitPipelineToolFields = async (e: FormEvent<HTMLFormElement>) => {
    updatePipelineToolFields(e);
    const params = {
      type: fields[0].value,
      token: fields[1].value,
      startTime: DateRange.startDate,
      endTime: DateRange.endDate,
    };

    verifyPipelineTool(params);
  };

  const handleResetPipelineToolFields = () => {
    initPipeLineFields();
    setIsDisableVerifyButton(true);
    dispatch(updatePipelineToolVerifyState(false));
  };

  return (
    <ConfigSectionContainer aria-label='Pipeline Tool Config'>
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.PIPELINE_TOOL}</ConfigSelectionTitle>
      <StyledForm
        onSubmit={handleSubmitPipelineToolFields}
        onChange={updatePipelineToolFields}
        onReset={handleResetPipelineToolFields}
      >
        <StyledTypeSelections variant='standard' required>
          <InputLabel id='pipelineTool-type-checkbox-label'>Pipeline Tool</InputLabel>
          <Select
            labelId='pipelineTool-type-checkbox-label'
            aria-label='Pipeline Tool type select'
            value={fields[0].value}
            onChange={(e) => onFormUpdate(ZERO, e.target.value)}
          >
            {Object.values(PIPELINE_TOOL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </StyledTypeSelections>
        <StyledTextField
          data-testid='pipelineToolTextField'
          key={fields[1].key}
          required
          label={fields[1].key}
          variant='standard'
          type='password'
          value={fields[1].value}
          onChange={(e) => onFormUpdate(1, e.target.value)}
          error={!fields[1].isValid || !fields[1].isRequired}
          helperText={updateFieldHelpText()}
        />
        <StyledButtonGroup>
          {isVerified && !isLoading ? (
            <VerifyButton disabled>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isLoading}>
              Verify
            </VerifyButton>
          )}
          {isVerified && !isLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
