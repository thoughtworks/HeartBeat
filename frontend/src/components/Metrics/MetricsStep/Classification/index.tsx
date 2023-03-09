import { Divider } from '@src/theme'
import { FormControl, InputLabel, Select } from '@mui/material'

interface classificationProps {
  title: string
  label: string
}

export const Classification = ({ title, label }: classificationProps) => {
  return (
    <>
      <Divider>
        <span>{title}</span>
      </Divider>
      <FormControl variant='standard'>
        <InputLabel>{label}</InputLabel>
        <Select defaultValue=''></Select>
      </FormControl>
    </>
  )
}
