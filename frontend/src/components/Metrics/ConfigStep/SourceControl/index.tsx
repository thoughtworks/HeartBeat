import React, { useState } from 'react'
import { CONFIG_TITLE, SOURCE_CONTROL_TYPES } from '@src/constants'
import {
  ResetButton,
  SourceControlButtonGroup,
  SourceControlForm,
  SourceControlSection,
  SourceControlTextField,
  SourceControlTitle,
  SourceControlTypeSelections,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/SourceControl/style'
import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { useAppSelector } from '@src/hooks/useAppDispatch'
import { selectSourceControlFields } from '@src/features/config/configSlice'
import { isSourceControlVerified } from '@src/features/sourceControl/sourceControlSlice'

export const SourceControl = () => {
  const sourceControlFields = useAppSelector(selectSourceControlFields)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const isVerified = useAppSelector(isSourceControlVerified)
  const [fields, setFields] = useState([
    {
      key: 'sourceControl',
      value: sourceControlFields.sourceControl,
      isValid: true,
    },
    {
      key: 'token',
      value: sourceControlFields.token,
      isValid: true,
    },
  ])
  return (
    <SourceControlSection>
      <SourceControlTitle>{CONFIG_TITLE.SOURCE_CONTROL}</SourceControlTitle>
      <SourceControlForm>
        <SourceControlTypeSelections variant='standard' required>
          <InputLabel id='sourceControl-type-checkbox-label'>sourceControl</InputLabel>
          <Select labelId='sourceControl-type-checkbox-label' value={fields[0].value}>
            {Object.values(SOURCE_CONTROL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </SourceControlTypeSelections>
        <SourceControlTextField
          data-testid='sourceControlTextField'
          key={fields[1].key}
          required
          label={fields[1].key}
          variant='standard'
          type='password'
          error={!fields[1].isValid}
          helperText={!fields[1].isValid ? 'token is required' : ''}
        />
        <SourceControlButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </SourceControlButtonGroup>
      </SourceControlForm>
    </SourceControlSection>
  )
}
