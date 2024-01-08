import { styled } from '@mui/material/styles'
import { ArrowBack } from '@mui/icons-material'
interface Property {
  onBack: () => void
}

const StyledDiv = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.65);
  font-size: 1rem;
`

const StyledArrowBack = styled(ArrowBack)`
  width: 1.5rem;
  margin-right: 0.5rem;
`

export const withGoBack =
  <P extends Property>(Child: React.ComponentType<P>) =>
  (prop: P) =>
    (
      <>
        <StyledDiv onClick={prop.onBack}>
          <StyledArrowBack />
          {'Back'}
        </StyledDiv>
        <Child {...prop} />
      </>
    )
