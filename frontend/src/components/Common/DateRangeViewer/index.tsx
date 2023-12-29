import { DateRangeContainer, StyledArrowForward, StyledCalendarToday } from './style'
import { formateDate } from '@src/utils/util'

type Props = {
  startDate: string
  endDate: string
}

const DateRangeViewer = ({ startDate, endDate }: Props) => {
  return (
    <DateRangeContainer>
      {formateDate(startDate)}
      <StyledArrowForward />
      {formateDate(endDate)}
      <StyledCalendarToday />
    </DateRangeContainer>
  )
}

export default DateRangeViewer
