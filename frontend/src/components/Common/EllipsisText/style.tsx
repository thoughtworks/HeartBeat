import styled from '@emotion/styled'
import { ellipsisProps } from '@src/layouts/style'

export const StyledText = styled.p(({ fitContent }: { fitContent: boolean }) => ({
  maxWidth: '100%',
  width: fitContent ? 'fit-content' : 'auto',
  ...ellipsisProps,
}))
