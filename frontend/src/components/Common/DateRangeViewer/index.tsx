import dayjs from 'dayjs'
import { DateRangeContainer, StyledArrowForward, StyledCalendarToday } from './style'
import { DATE_FORMATE_TEMPLATE } from '@src/constants/template'

type Props = {
  startDate: string
  endDate: string
}

const DateRangeViewer = ({ startDate, endDate }: Props) => {
  const formattedStartDate = dayjs(startDate).format(DATE_FORMATE_TEMPLATE)
  const formattedEndDate = dayjs(endDate).format(DATE_FORMATE_TEMPLATE)
  return (
    <DateRangeContainer>
      {formattedStartDate}
      <StyledArrowForward />
      {formattedEndDate}
      <StyledCalendarToday />
    </DateRangeContainer>
  )
}

export default DateRangeViewer
