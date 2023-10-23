import { FormHelperText } from '@mui/material'
import { DEFAULT_HELPER_TEXT } from '@src/constants'
import React, { useEffect, useState } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveUsers, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { styled } from '@mui/material/styles'
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete'

interface crewsProps {
  options: string[]
  title: string
  label: string
}

export const WarningMessage = styled('p')({
  color: 'red',
})

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

  const handleCrewChange = (event, value) => {
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
