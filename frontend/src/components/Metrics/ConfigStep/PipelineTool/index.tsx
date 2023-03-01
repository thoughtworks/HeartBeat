import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { PIPELINE_TOOL_TYPES, CONFIG_TITLE, ZERO } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  PipelineToolButtonGroup,
  PipelineToolForm,
  PipelineToolLoadingDrop,
  PipelineToolSection,
  PipelineToolTextField,
  PipelineToolTitle,
  PipelineToolTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/PipelineTool/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { changePipelineToolVerifyState, isPipelineToolVerified } from '@src/features/pipelineTool/pipelineToolSlice'
import { selectPipelineToolFields, updatePipelineToolFields } from '@src/features/config/configSlice'
import { useVerifyPipelineToolState } from '@src/hooks/useVerifyPipelineToolState'
import { ErrorNotification } from '@src/components/ErrorNotifaction'

export const PipelineTool = () => {
  const dispatch = useAppDispatch()
  const pipelineToolFields = useAppSelector(selectPipelineToolFields)
  const isVerified = useAppSelector(isPipelineToolVerified)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const [fields, setFields] = useState([
    {
      key: 'PipelineTool',
      value: pipelineToolFields.pipelineTool,
      isValid: true,
    },
    {
      key: 'Token',
      value: pipelineToolFields.token,
      isValid: true,
    },
  ])
  const { verifyPipelineTool, isVerifyLoading, isErrorNotification, showErrorMessage } = useVerifyPipelineToolState()
  useEffect(() => {
    dispatch(
      updatePipelineToolFields({
        pipelineTool: pipelineToolFields.pipelineTool,
        token: '',
      })
    )
    setIsDisableVerifyButton(true)
    dispatch(changePipelineToolVerifyState(false))
  }, [pipelineToolFields.pipelineTool, dispatch])

  const initPipeLineFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === ZERO ? PIPELINE_TOOL_TYPES.BUILD_KITE : ''
      return field
    })
    setFields(newFields)
    dispatch(changePipelineToolVerifyState(false))
  }

  const checkFieldValid = (value: string): boolean => value !== ''

  const onFormUpdate = (index: number, value: string) => {
    if (index === ZERO) {
      const newFieldsValue = fields.map((field, index) => {
        if (index !== ZERO) field.value = ''
        return field
      })
      setFields(newFieldsValue)
      dispatch(changePipelineToolVerifyState(false))
      return
    }
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (fieldIndex === index) {
        field.value = value
        field.isValid = checkFieldValid(value)
      }
      return field
    })
    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isValid && field.value != ''))
    setFields(newFieldsValue)
  }

  const handleSubmitPipelineToolFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updatePipelineToolFields({
        pipelineTool: fields[0].value,
        token: fields[1].value,
      })
    )
    await verifyPipelineTool()
    dispatch(changePipelineToolVerifyState(true))
  }

  const handleResetBPipelineToolFields = () => {
    initPipeLineFields()
    setIsDisableVerifyButton(true)
    dispatch(changePipelineToolVerifyState(false))
  }

  return (
    <PipelineToolSection>
      {isErrorNotification && <ErrorNotification message={showErrorMessage} />}
      {isVerifyLoading && (
        <PipelineToolLoadingDrop open={isVerifyLoading} data-testid='circularProgress'>
          <CircularProgress size='8rem' />
        </PipelineToolLoadingDrop>
      )}
      <PipelineToolTitle>{CONFIG_TITLE.PIPELINE_TOOL}</PipelineToolTitle>
      <PipelineToolForm onSubmit={handleSubmitPipelineToolFields} onReset={handleResetBPipelineToolFields}>
        <PipelineToolTypeSelections variant='standard' required>
          <InputLabel id='pipelineTool-type-checkbox-label'>PipelineTool</InputLabel>
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
          helperText={!fields[1].isValid ? 'token is required' : ''}
        />
        <PipelineToolButtonGroup>
          <VerifyButton type='submit' disabled={isDisableVerifyButton || isVerifyLoading}>
            {isVerified ? 'Verified' : 'Verify'}
          </VerifyButton>
          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </PipelineToolButtonGroup>
      </PipelineToolForm>
    </PipelineToolSection>
  )
}
