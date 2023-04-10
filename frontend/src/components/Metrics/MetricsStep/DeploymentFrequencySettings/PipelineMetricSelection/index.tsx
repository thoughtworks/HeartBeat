import React, { useEffect, useState } from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton } from './style'
import { Loading } from '@src/components/Loading'
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { selectConfig } from '@src/context/config/configSlice'
import dayjs from 'dayjs'

interface pipelineMetricSelectionProps {
  deploymentFrequencySetting: {
    id: number
    organization: string
    pipelineName: string
    steps: string
  }
  isShowRemoveButton: boolean
  errorMessages: { organization: string; pipelineName: string; steps: string } | undefined
}

export const PipelineMetricSelection = ({
  deploymentFrequencySetting,
  isShowRemoveButton,
  errorMessages,
}: pipelineMetricSelectionProps) => {
  const [stepsForSelection, setStepsForSelection] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const config = useAppSelector(selectConfig)
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect()
  const { pipelineList } = config.pipelineTool.verifiedResponse
  const { id, organization, pipelineName, steps } = deploymentFrequencySetting
  const organizationNameOptions = [...new Set(pipelineList.map((item) => item.orgName))]
  const pipelineNameOptions = pipelineList
    .filter((pipeline) => pipeline.orgName === organization)
    .map((item) => item.name)

  useEffect(() => {
    if (organization && pipelineName) {
      const { params, buildId, organizationId, pipelineType, token } = getStepsParams()
      getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
        res && setStepsForSelection([...Object.values(res)])
      })
    }
  }, [organization, pipelineName])

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const getStepsParams = () => {
    const item = pipelineList.find((pipeline) => pipeline.name === pipelineName)

    const { startDate, endDate } = config.basic.dateRange
    const pipelineType = config.pipelineTool.config.type
    const token = config.pipelineTool.config.token
    return {
      params: {
        pipelineName: item?.name ?? '',
        repository: item?.repository ?? '',
        orgName: item?.orgName ?? '',
        startTime: dayjs(startDate).startOf('date').valueOf(),
        endTime: dayjs(endDate).startOf('date').valueOf(),
      },
      buildId: item?.id ?? '',
      organizationId: item?.orgId ?? '',
      pipelineType,
      token,
    }
  }

  return (
    <PipelineMetricSelectionWrapper>
      {isLoading && <Loading />}
      {errorMessage && <ErrorNotification message={errorMessage} />}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        errorMessage={errorMessages?.organization}
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          errorMessage={errorMessages?.pipelineName}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsForSelection}
          label={'Steps'}
          value={steps}
          errorMessage={errorMessages?.steps}
        />
      )}
      <ButtonWrapper>{isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove</RemoveButton>}</ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
