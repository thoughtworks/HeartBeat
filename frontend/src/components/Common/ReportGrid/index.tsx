import React from 'react'
import { Grid } from '@mui/material'
import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard'

export const ReportGrid = () => {
  return (
    <>
      <Grid container justifyContent='center' spacing={3}>
        <Grid item xs={12}>
          <ReportCard className={'1'} title='Title1' />
        </Grid>
        <Grid item xs={6}>
          <ReportCard className={'2'} title='Title2' />
        </Grid>
        <Grid item xs={6}>
          <ReportCard className={'3'} title='Title3' />
        </Grid>
        <Grid item xs={3}>
          <ReportCard className={'4'} title='Title4' />
        </Grid>
        <Grid item xs={3}>
          <ReportCard className={'5'} title='Title5' />
        </Grid>
        <Grid item xs={3}>
          <ReportCard className={'6'} title='Title6' />
        </Grid>
        <Grid item xs={3}>
          <ReportCard className={'7'} title='Title7' />
        </Grid>
      </Grid>
    </>
  )
}
