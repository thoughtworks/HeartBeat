import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormControlWrapper } from './style'
import { getEmojiUrls, removeExtraEmojiName } from '@src/emojis/emoji'
import { EmojiWrap, StyledAvatar } from '@src/emojis/style'

interface Props {
  options: string[]
  label: string
  value: string
  id: number
  onGetSteps?: (pipelineName: string) => void
  step?: string
  onUpDatePipeline: (id: number, label: string, value: string) => void
}

export const SingleSelection = ({ options, label, value, id, onGetSteps, step, onUpDatePipeline }: Props) => {
  const labelId = `single-selection-${label.toLowerCase().replace(' ', '-')}`
  const [selectedOptions, setSelectedOptions] = useState(value)

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setSelectedOptions(newValue)
    if (onGetSteps) {
      onUpDatePipeline(id, 'Step', '')
      onGetSteps(newValue)
    }
    onUpDatePipeline(id, label, newValue)
  }

  useEffect(() => {
    if (onGetSteps && !!selectedOptions && !step) {
      onGetSteps(selectedOptions)
    }
  }, [])

  const emojiView = (pipelineStepName: string) => {
    const emojiUrls: string[] = getEmojiUrls(pipelineStepName)
    return emojiUrls.map((url) => <StyledAvatar key={url} src={url} />)
  }

  return (
    <>
      <FormControlWrapper variant='standard' required>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select labelId={labelId} value={value} onChange={handleChange}>
          {options.map((data) => (
            <MenuItem key={data} value={data} data-test-id={labelId}>
              <EmojiWrap>
                {emojiView(data)}
                <ListItemText primary={removeExtraEmojiName(data)} />
              </EmojiWrap>
            </MenuItem>
          ))}
        </Select>
      </FormControlWrapper>
    </>
  )
}
