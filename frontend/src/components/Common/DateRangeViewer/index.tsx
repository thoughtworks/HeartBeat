import dayjs from 'dayjs'
import { DateRangeContainer, StyledArrowForward, StyledCalendarToday } from './style'
import { DATE_FORMATE_TEMPLATE } from '@src/constants/template'

type Props = {
  startDate: string
  endDate: string
}

const DateRangeViewer = ({ startDate, endDate }: Props) => {
  return (
    <DateRangeContainer>
      {dayjs(startDate).format(DATE_FORMATE_TEMPLATE)}
      <StyledArrowForward />
      {dayjs(endDate).format(DATE_FORMATE_TEMPLATE)}
      <StyledCalendarToday />
    </DateRangeContainer>
  )
}

export default DateRangeViewer
