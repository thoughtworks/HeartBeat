import HomeGuide from '@src/components/HomeGuide'
import { fireEvent, render } from '@testing-library/react'
import * as router from 'react-router-dom'

const CREATE_NEW_PROJECT = 'Create a new project'
describe('HomeGuide', () => {
  it('should show 2 buttons', () => {
    const { getByText } = render(<HomeGuide />)

    expect(getByText('Import project from file')).toBeInTheDocument()
    expect(getByText(CREATE_NEW_PROJECT)).toBeInTheDocument()
  })
  it('should go to metrics page when click create a new project button', async () => {
    const navigate = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    const { getByText } = render(<HomeGuide />)

    fireEvent.click(getByText(CREATE_NEW_PROJECT))

    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('/metrics')
  })
})
