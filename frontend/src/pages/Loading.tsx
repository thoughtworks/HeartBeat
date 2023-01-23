import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import RotateRight from '@mui/icons-material/RotateRight'

const LoadingWarp = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
})

const LoadingContainer = styled.span({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const rotateKeyframe = keyframes`
  0 {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const RotateRightIcon = styled(RotateRight)({
  height: '4rem',
  width: '4rem',
  animation: `${rotateKeyframe} 1s linear infinite`,
})

export const Loading = () => {
  return (
    <LoadingWarp>
      <LoadingContainer>
        <RotateRightIcon />
        <span>Loading...</span>
      </LoadingContainer>
    </LoadingWarp>
  )
}
