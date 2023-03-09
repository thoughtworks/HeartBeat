import React from 'react'
import { FormSelect } from '@src/components/common/FormSelect'
import MetricsSettingTitle from '@src/components/common/MetricsSettingTitle'

interface cycletimeProps {
  options: string[]
  title: string
}

export const CycleTime = ({ options, title }: cycletimeProps) => (
  <>
    <MetricsSettingTitle title={title} />
    <FormSelect label={'TODO'} defaultSelected={['To do']} options={options} />
    <FormSelect label={'Done'} defaultSelected={['Done']} options={options} />
    <FormSelect label={'Doing'} defaultSelected={['In Dev']} options={options} />
    <FormSelect label={'Testing'} defaultSelected={['Testing']} options={options} />
    <FormSelect label={'Blocked'} defaultSelected={['Block']} options={options} />
  </>
)
