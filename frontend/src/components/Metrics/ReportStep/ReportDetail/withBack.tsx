import { styled } from '@mui/material/styles'
import { ArrowBack } from '@mui/icons-material'
interface Property {
  onBack: () => void
}

const StyledDiv = styled('div')`
`

export const withGoBack = <P extends Property>(Child: React.ComponentType<P>) => (prop: P) => <>
  <StyledDiv onClick={prop.onBack}><ArrowBack />{'Back'}</StyledDiv>
  <Child {...prop} />
</>