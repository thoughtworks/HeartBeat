import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { PIPELINE_TOOL_TYPES, CONFIG_TITLE, ZERO, BUILDKITE_TOKEN_REGEXP, TOKEN_HELPER_TEXT } from '@src/constants'
import { FormEvent, useState } from 'react'
import {
  PipelineToolButtonGroup,
  PipelineToolForm,
  PipelineToolSection,
  PipelineToolTextField,
  PipelineToolTitle,
  PipelineToolTypeSelections,
} from '@src/components/Metrics/ConfigStep/PipelineTool/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { updatePipelineToolVerifyState, isPipelineToolVerified } from '@src/context/pipelineTool/pipelineToolSlice'
import { selectDateRange, selectPipelineToolFields, updatePipelineToolFields } from '@src/context/config/configSlice'
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { Loading } from '@src/components/Loading'
import { ResetButton, VerifyButton } from '@src/components/Common/Buttons'

export const PipelineTool = () => {
  const dispatch = useAppDispatch()
  const pipelineToolFields = useAppSelector(selectPipelineToolFields)
  const DateRange = useAppSelector(selectDateRange)
  const isVerified = useAppSelector(isPipelineToolVerified)
  const { verifyPipelineTool, isLoading, errorMessage } = useVerifyPipelineToolEffect()
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const [fields, setFields] = useState([
    {
      key: 'PipelineTool',
      value: pipelineToolFields.pipelineTool,
      isValid: true,
      isRequired: true,
    },
    {
      key: 'Token',
      value: pipelineToolFields.token,
      isValid: true,
      isRequired: true,
    },
  ])

  const initPipeLineFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === ZERO ? PIPELINE_TOOL_TYPES.BUILD_KITE : ''
      return field
    })
    setFields(newFields)
    dispatch(updatePipelineToolVerifyState(false))
  }

  const checkFieldValid = (value: string): boolean => {
    return BUILDKITE_TOKEN_REGEXP.test(value)
  }
  const onFormUpdate = (index: number, value: string) => {
    let newFieldsValue
    if (index === ZERO) {
      newFieldsValue = fields.map((field, index) => {
        field.value = value
        if (index !== ZERO) {
          field.value = ''
          field.isRequired = true
          field.isValid = true
        }
        return field
      })
    } else {
      newFieldsValue = fields.map((field, fieldIndex) => {
        if (fieldIndex === 1) {
          field.value = value
          field.isValid = checkFieldValid(value)
          field.isRequired = value !== ''
        }
        return field
      })
    }
    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isValid && field.isRequired && field.value !== ''))
    setFields(newFieldsValue)
    dispatch(updatePipelineToolVerifyState(false))
  }

  const updateFieldHelpText = (field: { key: string; isRequired: boolean; isValid: boolean }) => {
    const { isRequired, isValid } = field
    if (!isRequired) {
      return TOKEN_HELPER_TEXT.RequiredTokenText
    }
    if (!isValid) {
      return TOKEN_HELPER_TEXT.InvalidTokenText
    }
    return ''
  }
  const handleSubmitPipelineToolFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updatePipelineToolFields({
        pipelineTool: fields[0].value,
        token: fields[1].value,
      })
    )
    const params = {
      type: fields[0].value,
      token: fields[1].value,
      startTime: DateRange.startDate,
      endTime: DateRange.endDate,
    }

    await verifyPipelineTool(params).then((res) => {
      if (res) {
        dispatch(updatePipelineToolVerifyState(res.isPipelineToolVerified))
        dispatch(updatePipelineToolFields(res.response))
      }
    })
  }

  const handleResetPipelineToolFields = () => {
    initPipeLineFields()
    setIsDisableVerifyButton(true)
    dispatch(updatePipelineToolVerifyState(false))
  }

  return (
    <PipelineToolSection>
      {errorMessage && <ErrorNotification message={errorMessage} />}
      {isLoading && <Loading />}
      <PipelineToolTitle>{CONFIG_TITLE.PIPELINE_TOOL}</PipelineToolTitle>
      <PipelineToolForm onSubmit={handleSubmitPipelineToolFields} onReset={handleResetPipelineToolFields}>
        <PipelineToolTypeSelections variant='standard' required>
          <InputLabel id='pipelineTool-type-checkbox-label'>Pipeline Tool</InputLabel>
          <Select
            labelId='pipelineTool-type-checkbox-label'
            value={fields[0].value}
            onChange={(e) => onFormUpdate(ZERO, e.target.value)}
          >
            {Object.values(PIPELINE_TOOL_TYPES).map((toolType) => (
              <MenuItem key={toolType} value={toolType}>
                <ListItemText primary={toolType} />
              </MenuItem>
            ))}
          </Select>
        </PipelineToolTypeSelections>
        <PipelineToolTextField
          data-testid='pipelineToolTextField'
          key={fields[1].key}
          required
          label={fields[1].key}
          variant='standard'
          type='password'
          value={fields[1].value}
          onChange={(e) => onFormUpdate(1, e.target.value)}
          error={!fields[1].isValid}
          helperText={updateFieldHelpText(fields[1])}
        />
        <PipelineToolButtonGroup>
          {isVerified && !isLoading ? (
            <VerifyButton>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isLoading}>
              Verify
            </VerifyButton>
          )}
          {isVerified && !isLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </PipelineToolButtonGroup>
      </PipelineToolForm>
    </PipelineToolSection>
  )
}
