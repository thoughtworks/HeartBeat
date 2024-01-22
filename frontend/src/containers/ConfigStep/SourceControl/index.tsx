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
import { VerifyButton, ResetButton } from '@src/components/Common/Buttons';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { findCaseInsensitiveType } from '@src/utils/util';
import { EMPTY_STRING } from '@src/constants/commons';
import { Loading } from '@src/components/Loading';
import { REGEX } from '@src/constants/regex';

enum FIELD_KEY {
  TYPE = 0,
  TOKEN = 1,
}

export const SourceControl = () => {
  const touched = useRef(false);
  const dispatch = useAppDispatch();
  const sourceControlFields = useAppSelector(selectSourceControl);
  const isVerified = useAppSelector(isSourceControlVerified);
  const { verifyToken, isLoading, errorMessage, clearErrorMessage } = useVerifySourceControlTokenEffect();
  const type = findCaseInsensitiveType(Object.values(SOURCE_CONTROL_TYPES), sourceControlFields.type);
  const [fields, setFields] = useState([
    {
      key: 'SourceControl',
      value: type,
      isValid: true,
      isRequired: true,
    },
    {
      key: 'Token',
      value: sourceControlFields.token,
      isValid: true,
      isRequired: true,
    },
  ]);

  const updateSourceControlFields = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      touched.current = true;
      e.preventDefault();
      dispatch(
        updateSourceControl({
          type: fields[FIELD_KEY.TYPE].value,
          token: fields[FIELD_KEY.TOKEN].value,
        }),
      );
    },
    [dispatch, fields],
  );

  const handleSubmitSourceControlFields = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      updateSourceControlFields(e);
      const params = {
        type: fields[FIELD_KEY.TYPE].value,
        token: fields[FIELD_KEY.TOKEN].value,
      };
      verifyToken(params);
    },
    [fields, updateSourceControlFields, verifyToken],
  );

  const handleResetSourceControlFields = useCallback(() => {
    const newFields = fields.map((field, index) => {
      field.value = index === FIELD_KEY.TOKEN ? '' : SOURCE_CONTROL_TYPES.GITHUB;
      return field;
    });
    setFields(newFields);
    dispatch(updateSourceControlVerifyState(false));
  }, [dispatch, fields]);

  const onTokenInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newFieldsValue = fields.map((field, fieldIndex) => {
        if (fieldIndex === FIELD_KEY.TOKEN) {
          field.value = value;
          field.isValid = value !== EMPTY_STRING && REGEX.GITHUB_TOKEN.test(value);
        }
        return field;
      });
      touched.current = true;
      clearErrorMessage();
      setFields(newFieldsValue);
      dispatch(updateSourceControlVerifyState(false));
    },
    [clearErrorMessage, dispatch, fields],
  );

  const sourceControlHelperText = useMemo(() => {
    const value = fields[FIELD_KEY.TOKEN].value;
    if (!touched.current) return '';
    if (errorMessage) return errorMessage;
    if (value === EMPTY_STRING) return TOKEN_HELPER_TEXT.RequiredTokenText;
    if (!REGEX.GITHUB_TOKEN.test(value)) return TOKEN_HELPER_TEXT.InvalidTokenText;
    return '';
  }, [errorMessage, fields]);

  const isSourceControlError = useMemo(() => touched.current && !!sourceControlHelperText, [sourceControlHelperText]);

  const isDisableVerifyButton = useMemo(
    () => isLoading || !fields.every((field) => field.isValid && !!field.value) || !!errorMessage,
    [errorMessage, fields, isLoading],
  );

  return (
    <ConfigSectionContainer aria-label='Source Control Config'>
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.SOURCE_CONTROL}</ConfigSelectionTitle>
      <StyledForm
        onSubmit={handleSubmitSourceControlFields}
        onChange={updateSourceControlFields}
        onReset={handleResetSourceControlFields}
      >
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
          value={fields[FIELD_KEY.TOKEN].value}
          onChange={onTokenInputChange}
          error={isSourceControlError}
          helperText={sourceControlHelperText}
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
