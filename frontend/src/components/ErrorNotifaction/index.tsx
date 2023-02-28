import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { forwardRef, useState } from 'react'
import { ErrorBar } from './style'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorNotification = (props: { message: string }) => {
  const { message } = props
  const [isOpen, setIsOpen] = useState(true)
  return (
    <ErrorBar open={isOpen} autoHideDuration={2000} onClose={() => setIsOpen(false)}>
      <Alert severity='error'>{message}</Alert>
    </ErrorBar>
  )
}
