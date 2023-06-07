import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import {
  BOARD_TYPES,
  PIPELINE_TOOL_TYPES,
  SOURCE_CONTROL_TYPES,
  SELECTED_VALUE_SEPARATOR,
  REQUIRED_DATA,
} from '@src/constants'
import { useEffect, useState } from 'react'
import { RequireDataSelections } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox/style'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import {
  isPipelineToolVerified,
  isSourceControlVerified,
  selectConfig,
  selectIsBoardVerified,
  updateBoard,
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineTool,
  updatePipelineToolVerifyState,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'
import { REQUIRED_DATA_LIST } from '../../../../../__tests__/src/fixtures'

export const MetricsTypeCheckbox = () => {
  const dispatch = useAppDispatch()
  const configData = useAppSelector(selectConfig)
  const isBoardVerify = useAppSelector(selectIsBoardVerified)
  const isPipelineToolVerify = useAppSelector(isPipelineToolVerified)
  const isSourceControlVerify = useAppSelector(isSourceControlVerified)
  const { isShow: isShowBoard } = configData.board
  const { isShow: isShowPipeline } = configData.pipelineTool
  const { isShow: isShowSourceControl } = configData.sourceControl
  const { metrics } = configData.basic
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const updateBoardState = () => {
    !isShowBoard &&
      dispatch(
        updateBoard({
          type: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        })
      )
    isShowBoard ? dispatch(updateBoardVerifyState(isBoardVerify)) : dispatch(updateBoardVerifyState(false))
  }

  useEffect(() => {
    metrics && dispatch(updateMetrics(metrics))
  }, [metrics, dispatch])

  const [isAllSelected, setIsAllSelected] = useState(false)

  const updatePipelineToolState = () => {
    !isShowPipeline && dispatch(updatePipelineTool({ type: PIPELINE_TOOL_TYPES.BUILD_KITE, token: '' }))
    isShowPipeline
      ? dispatch(updatePipelineToolVerifyState(isPipelineToolVerify))
      : dispatch(updatePipelineToolVerifyState(false))
  }

  const updateSourceControlState = () => {
    !isShowSourceControl && dispatch(updateSourceControl({ type: SOURCE_CONTROL_TYPES.GITHUB, token: '' }))
    isShowSourceControl
      ? dispatch(updateSourceControlVerifyState(isSourceControlVerify))
      : dispatch(updateSourceControlVerifyState(false))
  }

  const handleSelectOptionsChange = (selectOptions: string | string[]) => {
    if (selectOptions.includes(REQUIRED_DATA.All) && !isAllSelected) {
      setIsAllSelected(true)
      selectOptions = Object.values(REQUIRED_DATA)
    } else if (selectOptions.length == REQUIRED_DATA_LIST.length - 1 && !isAllSelected) {
      setIsAllSelected(true)
      selectOptions = Object.values(REQUIRED_DATA)
    } else if (selectOptions.includes(REQUIRED_DATA.All)) {
      setIsAllSelected(false)
      selectOptions = selectOptions.slice(1)
    } else if (!selectOptions.includes(REQUIRED_DATA.All) && isAllSelected) {
      setIsAllSelected(false)
      selectOptions = []
    }
    return selectOptions
  }

  const handleRequireDataChange = (event: SelectChangeEvent<typeof metrics>) => {
    const {
      target: { value },
    } = event

    dispatch(updateMetrics(handleSelectOptionsChange(value)))
    handleSelectOptionsChange(value).length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false)
    updateBoardState()
    updatePipelineToolState()
    updateSourceControlState()
  }

  const handleRenderSelectOptions = (selected: string[]) => {
    if (selected.includes(REQUIRED_DATA.All)) {
      return selected.slice(1).join(SELECTED_VALUE_SEPARATOR)
    }
    return selected.join(SELECTED_VALUE_SEPARATOR)
  }

  return (
    <>
      <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required data</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={handleRequireDataChange}
          renderValue={handleRenderSelectOptions}
        >
          {Object.values(REQUIRED_DATA).map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={metrics.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
      {isShowBoard && <Board />}
      {isShowPipeline && <PipelineTool />}
      {isShowSourceControl && <SourceControl />}
    </>
  )
}
