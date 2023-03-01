import { setupStore } from '../../../utils/setupStoreUtil'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'
import { CONFIG_TITLE, SOURCE_CONTROL_FIELDS } from '../../../fixtures'
import { SOURCE_CONTROL_TYPES } from '@src/constants'

let store = setupStore()
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <SourceControl />
    </Provider>
  )
}

describe('SourceControl', () => {
  it('should show sourceControl title and fields when render sourceControl component', () => {
    const { getByRole, getByLabelText } = setup()

    expect(getByRole('heading', { name: CONFIG_TITLE.SOURCE_CONTROL })).toBeInTheDocument()
    SOURCE_CONTROL_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
  })

  it('should show default value gitHub when init sourceControl component', () => {
    const { getByText } = setup()
    const sourceControlType = getByText(SOURCE_CONTROL_TYPES.GIT_HUB)

    expect(sourceControlType).toBeInTheDocument()
  })
})
