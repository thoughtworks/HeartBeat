import React, { useMemo, useState } from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import {
  ButtonWrapper,
  FormControlWrapper,
  PipelineMetricSelectionWrapper,
  RemoveButton,
  WarningMessage,
} from './style'
import { Loading } from '@src/components/Loading'
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import {
  selectBranches,
  selectPipelineNames,
  selectPipelineOrganizations,
  selectSteps,
  selectStepsParams,
  updatePipelineToolVerifyResponseSteps,
} from '@src/context/config/configSlice'
import { store } from '@src/store'
import {
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectStepWarningMessage,
  updatePipelineStep,
} from '@src/context/Metrics/metricsSlice'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import { NO_STEP_WARNING_MESSAGE, SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { Checkbox, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import _ from 'lodash'

interface pipelineMetricSelectionProps {
  type: string
  pipelineSetting: {
    id: number
    organization: string
    pipelineName: string
    step: string
    branches: string[]
  }
  isShowRemoveButton: boolean
  onRemovePipeline: (id: number) => void
  onUpdatePipeline: (id: number, label: string, value: any) => void
  isDuplicated: boolean
}

export const PipelineMetricSelection = ({
  type,
  pipelineSetting,
  isShowRemoveButton,
  onRemovePipeline,
  onUpdatePipeline,
  isDuplicated,
}: pipelineMetricSelectionProps) => {
  const { id, organization, pipelineName, step, branches } = pipelineSetting
  const dispatch = useAppDispatch()
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect()
  const organizationNameOptions = selectPipelineOrganizations(store.getState())
  const pipelineNameOptions = selectPipelineNames(store.getState(), organization)
  const stepsOptions = selectSteps(store.getState(), organization, pipelineName)
  const branchesOptions = selectBranches(store.getState(), organization, pipelineName)
  const organizationWarningMessage = selectOrganizationWarningMessage(store.getState(), id, type)
  const pipelineNameWarningMessage = selectPipelineNameWarningMessage(store.getState(), id, type)
  const stepWarningMessage = selectStepWarningMessage(store.getState(), id, type)
  const [isShowNoStepWarning, setIsShowNoStepWarning] = useState(false)
  const isAllBranchesSelected = useMemo(
    () => !_.isEmpty(branchesOptions) && _.isEqual(branches.length, branchesOptions.length),
    [branches, branchesOptions]
  )

  const handleClick = () => {
    onRemovePipeline(id)
  }

  const handleGetSteps = (_pipelineName: string) => {
    const { params, buildId, organizationId, pipelineType, token } = selectStepsParams(
      store.getState(),
      organization,
      _pipelineName
    )
    getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
      const steps = res?.response ?? []
      const branches = res?.branches ?? []
      dispatch(updatePipelineToolVerifyResponseSteps({ organization, pipelineName: _pipelineName, steps, branches }))
      res?.haveStep && dispatch(updatePipelineStep({ steps, id, type, branches }))
      res && setIsShowNoStepWarning(!res.haveStep)
    })
  }

  const handleBranchChange = (event: SelectChangeEvent<string[]>) => {
    let selectBranches = event.target.value
    if (_.isEqual(selectBranches[selectBranches.length - 1], 'All')) {
      /* istanbul ignore next */
      selectBranches = _.isEqual(branchesOptions.length, branches.length) ? [] : branchesOptions
    }
    onUpdatePipeline(id, 'Branches', selectBranches)
  }

  const BranchSelection = () => (
    <>
      <FormControlWrapper variant='standard' required>
        <InputLabel>Branches</InputLabel>
        <Select
          labelId='branch-data-multiple-checkbox-label'
          multiple
          value={branches}
          onChange={handleBranchChange}
          renderValue={() => branches.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllBranchesSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {branchesOptions.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={branches.includes(data)} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
      </FormControlWrapper>
    </>
  )

  return (
    <PipelineMetricSelectionWrapper>
      {organizationWarningMessage && <WarningNotification message={organizationWarningMessage} />}
      {pipelineNameWarningMessage && <WarningNotification message={pipelineNameWarningMessage} />}
      {stepWarningMessage && <WarningNotification message={stepWarningMessage} />}
      {isShowNoStepWarning && <WarningNotification message={NO_STEP_WARNING_MESSAGE} />}
      {isLoading && <Loading />}
      {isDuplicated && <WarningMessage>This pipeline is the same as another one!</WarningMessage>}
      {errorMessage && <ErrorNotification message={errorMessage} />}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          step={step}
          onGetSteps={handleGetSteps}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsOptions}
          label={'Step'}
          value={step}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && <BranchSelection />}
      <ButtonWrapper>
        {isShowRemoveButton && (
          <RemoveButton data-test-id={'remove-button'} onClick={handleClick}>
            Remove
          </RemoveButton>
        )}
      </ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
