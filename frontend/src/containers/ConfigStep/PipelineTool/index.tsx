import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import {
  isPipelineToolVerified,
  selectPipelineTool,
  updatePipelineTool,
  updatePipelineToolVerifyState,
} from '@src/context/config/configSlice';
import { CONFIG_TITLE, PIPELINE_TOOL_TYPES, TOKEN_HELPER_TEXT } from '@src/constants/resources';
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect';
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { DEFAULT_HELPER_TEXT, EMPTY_STRING } from '@src/constants/commons';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { findCaseInsensitiveType } from '@src/utils/util';
import { FormEvent, useMemo, useState } from 'react';
import { Loading } from '@src/components/Loading';
import { REGEX } from '@src/constants/regex';

enum FIELD_KEY {
  TYPE = 0,
  TOKEN = 1,
}

const getErrorMessage = (value: string) => {
  if (!value) {
    return TOKEN_HELPER_TEXT.RequiredTokenText;
  }
  if (!REGEX.BUILDKITE_TOKEN.test(value.trim())) {
    return TOKEN_HELPER_TEXT.InvalidTokenText;
  }
  return DEFAULT_HELPER_TEXT;
};

export const PipelineTool = () => {
  const dispatch = useAppDispatch();
  const pipelineToolFields = useAppSelector(selectPipelineTool);
  const isVerified = useAppSelector(isPipelineToolVerified);
  const { verifyPipelineTool, isLoading, verifiedError, clearVerifiedError } = useVerifyPipelineToolEffect();
  const type = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), pipelineToolFields.type);
  const [fields, setFields] = useState([
    {
      key: 'PipelineTool',
      value: type,
      validatedError: '',
    },
    {
      key: 'Token',
      value: pipelineToolFields.token,
      validatedError: pipelineToolFields.token ? getErrorMessage(pipelineToolFields.token) : '',
    },
  ]);

  const handleUpdate = (fields: { key: string; value: string; validatedError: string }[]) => {
    clearVerifiedError();
    setFields(fields);
    dispatch(updatePipelineToolVerifyState(false));
    dispatch(
      updatePipelineTool({
        type: fields[FIELD_KEY.TYPE].value,
        token: fields[FIELD_KEY.TOKEN].value,
      }),
    );
  };

  const onSelectUpdate = (value: string) => {
    const newFields = fields.map(({ key }, index) => ({
      key,
      value: index === FIELD_KEY.TYPE ? value : EMPTY_STRING,
      validatedError: '',
    }));
    handleUpdate(newFields);
  };

  const getNewFields = (value: string) =>
    fields.map((field, index) =>
      index === FIELD_KEY.TOKEN
        ? {
            key: field.key,
            value: value.trim(),
            validatedError: getErrorMessage(value.trim()),
          }
        : field,
    );

  const onInputUpdate = (value: string) => handleUpdate(getNewFields(value));

  const onInputFocus = (value: string) => setFields(getNewFields(value));

  const onReset = () => {
    const newFields = fields.map(({ key }, index) => ({
      key,
      value: index === FIELD_KEY.TYPE ? PIPELINE_TOOL_TYPES.BUILD_KITE : EMPTY_STRING,
      validatedError: '',
    }));
    handleUpdate(newFields);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyPipelineTool({
      type: fields[FIELD_KEY.TYPE].value,
      token: fields[FIELD_KEY.TOKEN].value,
    });
  };

  const isDisableVerifyButton = useMemo(
    () => isLoading || fields.some((field) => !field.value || field.validatedError) || !!verifiedError,
    [fields, isLoading, verifiedError],
  );

  return (
    <ConfigSectionContainer aria-label='Pipeline Tool Config'>
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.PIPELINE_TOOL}</ConfigSelectionTitle>
      <StyledForm onSubmit={onSubmit} onReset={onReset}>
        <StyledTypeSelections variant='standard' required>
          <InputLabel id='pipelineTool-type-checkbox-label'>Pipeline Tool</InputLabel>
          <Select
            labelId='pipelineTool-type-checkbox-label'
            aria-label='Pipeline Tool type select'
            value={fields[FIELD_KEY.TYPE].value}
            onChange={(e) => onSelectUpdate(e.target.value)}
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
          key={fields[FIELD_KEY.TOKEN].key}
          required
          label={fields[FIELD_KEY.TOKEN].key}
          variant='standard'
          type='password'
          inputProps={{ 'aria-label': `input ${fields[FIELD_KEY.TOKEN].key}` }}
          value={fields[FIELD_KEY.TOKEN].value}
          onFocus={(e) => onInputFocus(e.target.value)}
          onChange={(e) => onInputUpdate(e.target.value)}
          error={!!fields[FIELD_KEY.TOKEN].validatedError || !!verifiedError}
          helperText={fields[FIELD_KEY.TOKEN].validatedError || verifiedError}
        />
        <StyledButtonGroup>
          {isVerified && !isLoading ? (
            <VerifyButton disabled>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton}>
              Verify
            </VerifyButton>
          )}
          {isVerified && !isLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
