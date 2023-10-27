import { FormHelperText } from '@mui/material'
import { DEFAULT_HELPER_TEXT } from '@src/constants'
import React, { useEffect, useState } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveUsers, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { AssigneeFilter } from '@src/components/Metrics/MetricsStep/Crews/AssigneeFilter'
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete'
import { WarningMessage } from '@src/components/Metrics/MetricsStep/Crews/style'

interface crewsProps {
  options: string[]
  title: string
  label: string
}

export const Crews = ({ options, title, label }: crewsProps) => {
  const dispatch = useAppDispatch()
  const [isEmptyCrewData, setIsEmptyCrewData] = useState<boolean>(false)
  const { users } = useAppSelector(selectMetricsContent)
  const [selectedCrews, setSelectedCrews] = useState<string[]>(users)
  const isAllSelected = options.length > 0 && selectedCrews.length === options.length

  useEffect(() => {
    setIsEmptyCrewData(selectedCrews.length === 0)
  }, [selectedCrews])

  useEffect(() => {
    dispatch(saveUsers(selectedCrews))
  }, [selectedCrews, dispatch])

  const handleCrewChange = (event: React.SyntheticEvent, value: string[]) => {
    if (value[value.length - 1] === 'All') {
      setSelectedCrews(selectedCrews.length === options.length ? [] : options)
      return
    }
    setSelectedCrews([...value])
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      <MultiAutoComplete
        optionList={options}
        isError={isEmptyCrewData}
        isSelectAll={isAllSelected}
        onChangeHandler={handleCrewChange}
        selectedOption={selectedCrews}
        textFieldLabel={label}
      />
      <AssigneeFilter />
      <FormHelperText>
        {isEmptyCrewData ? (
          <WarningMessage>
            {label} is <strong>required</strong>
          </WarningMessage>
        ) : (
          DEFAULT_HELPER_TEXT
        )}
      </FormHelperText>
    </>
  )
}
