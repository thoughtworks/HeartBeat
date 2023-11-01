import {
  CollectionDateContainer,
  StartColoredTopArea,
  GreyTransitionBox,
  TextBox,
  EndColoredTopArea,
  StartTitle,
  EndTitle,
  DateText,
  MonthYearText,
} from '@src/components/Common/CollectionDuration/style'
import dayjs from 'dayjs'

type Props = {
  startDate: string
  endDate: string
}

type DisplayedDateInfo = {
  year: string
  month: string
  day: string
}

const CollectionDuration = ({ startDate, endDate }: Props) => {
  const startDateInfo: DisplayedDateInfo = {
    year: dayjs(startDate).format('YY'),
    month: dayjs(startDate).format('MMM'),
    day: dayjs(startDate).format('DD'),
  }
  const endDateInfo: DisplayedDateInfo = {
    year: dayjs(endDate).format('YY'),
    month: dayjs(endDate).format('MMM'),
    day: dayjs(endDate).format('DD'),
  }

  return (
    <>
      <CollectionDateContainer>
        <div>
          <StartTitle>START</StartTitle>
          <StartColoredTopArea />
          <TextBox>
            <DateText>{startDateInfo.day}</DateText>
            <MonthYearText>
              {startDateInfo.month} {startDateInfo.year}
            </MonthYearText>
          </TextBox>
        </div>
        <GreyTransitionBox />
        <div>
          <EndTitle>END</EndTitle>
          <EndColoredTopArea />
          <TextBox>
            <DateText>{endDateInfo.day}</DateText>
            <MonthYearText>
              {endDateInfo.month} {endDateInfo.year}
            </MonthYearText>
          </TextBox>
        </div>
      </CollectionDateContainer>
    </>
  )
}

export default CollectionDuration
