import {
  ConfigSectionContainer,
  StyledButtonGroup,
  StyledForm,
  StyledTextField,
  StyledTypeSelections,
} from '@src/components/Common/ConfigForms';
import {
  isSourceControlVerified,
  selectSourceControl,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice';
import { useVerifySourceControlTokenEffect } from '@src/hooks/useVerifySourceControlTokenEffect';
import { CONFIG_TITLE, SOURCE_CONTROL_TYPES, TOKEN_HELPER_TEXT } from '@src/constants/resources';
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { DEFAULT_HELPER_TEXT } from '@src/constants/commons';
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
  if (!REGEX.GITHUB_TOKEN.test(value.trim())) {
    return TOKEN_HELPER_TEXT.InvalidTokenText;
  }
  return DEFAULT_HELPER_TEXT;
};

export const SourceControl = () => {
  const dispatch = useAppDispatch();
  const sourceControlFields = useAppSelector(selectSourceControl);
  const isVerified = useAppSelector(isSourceControlVerified);
  const { verifyToken, isLoading, verifiedError, clearVerifiedError } = useVerifySourceControlTokenEffect();
  const type = findCaseInsensitiveType(Object.values(SOURCE_CONTROL_TYPES), sourceControlFields.type);
  const [fields, setFields] = useState([
    {
      key: 'SourceControl',
      value: type,
      validatedError: '',
    },
    {
      key: 'Token',
      value: sourceControlFields.token,
      validatedError: sourceControlFields.token ? getErrorMessage(sourceControlFields.token) : '',
    },
  ]);

  const handleUpdate = (fields: { key: string; value: string; validatedError: string }[]) => {
    clearVerifiedError();
    setFields(fields);
    dispatch(updateSourceControlVerifyState(false));
    dispatch(
      updateSourceControl({
        type: fields[FIELD_KEY.TYPE].value,
        token: fields[FIELD_KEY.TOKEN].value,
      }),
    );
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

  const onInputChange = (value: string) => handleUpdate(getNewFields(value));

  const onInputFocus = (value: string) => setFields(getNewFields(value));

  const onReset = () => {
    const newFields = fields.map(({ key }, index) => ({
      key,
      value: index === FIELD_KEY.TOKEN ? '' : SOURCE_CONTROL_TYPES.GITHUB,
      validatedError: '',
    }));
    handleUpdate(newFields);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyToken({
      type: fields[FIELD_KEY.TYPE].value as SOURCE_CONTROL_TYPES,
      token: fields[FIELD_KEY.TOKEN].value,
    });
  };

  const isDisableVerifyButton = useMemo(
    () => isLoading || fields.some((field) => !field.value || field.validatedError) || !!verifiedError,
    [verifiedError, fields, isLoading],
  );

  return (
    <ConfigSectionContainer aria-label='Source Control Config'>
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.SOURCE_CONTROL}</ConfigSelectionTitle>
      <StyledForm onSubmit={onSubmit} onReset={onReset}>
        <StyledTypeSelections variant='standard' required>
          <InputLabel id='sourceControl-type-checkbox-label'>Source Control</InputLabel>
          <Select labelId='sourceControl-type-checkbox-label' value={fields[FIELD_KEY.TYPE].value}>
            {Object.values(SOURCE_CONTROL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </StyledTypeSelections>
        <StyledTextField
          data-testid='sourceControlTextField'
          key={fields[FIELD_KEY.TOKEN].key}
          required
          label={fields[FIELD_KEY.TOKEN].key}
          variant='standard'
          type='password'
          inputProps={{ 'aria-label': `input ${fields[FIELD_KEY.TOKEN].key}` }}
          value={fields[FIELD_KEY.TOKEN].value}
          onFocus={(e) => onInputFocus(e.target.value)}
          onChange={(e) => onInputChange(e.target.value)}
          error={!!fields[FIELD_KEY.TOKEN].validatedError || !!verifiedError}
          helperText={fields[FIELD_KEY.TOKEN].validatedError || verifiedError}
        />
        <StyledButtonGroup>
          {isVerified && !isLoading ? (
            <>
              <VerifyButton disabled>Verified</VerifyButton>
              <ResetButton type='reset'>Reset</ResetButton>
            </>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton}>
              Verify
            </VerifyButton>
          )}
        </StyledButtonGroup>
      </StyledForm>
    </ConfigSectionContainer>
  );
};
