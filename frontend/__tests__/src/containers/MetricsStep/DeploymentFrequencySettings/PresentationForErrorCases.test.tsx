import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import each from 'jest-each'
import { store } from '@src/store'
import PresentationForErrorCases from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases'
import { IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient'

const setup = (props: IGetPipelineToolInfoResult) =>
  render(
    <Provider store={store}>
      <PresentationForErrorCases {...props} />
    </Provider>
  )

describe('<PresentationForErrorCases />', () => {
  const errors = [
    { code: 204, title: 'No pipeline!' },
    { code: 400, title: 'Invalid input!' },
    { code: 204, title: 'Unauthorized request!' },
    { code: 204, title: 'Forbidden request!' },
    { code: 204, title: 'Not found!' },
    { code: undefined, title: 'Unknown error' },
  ]
  const errorMessage =
    'Please go back to the previous page and change your pipeline token with correct access permission.'
  each(errors).it(
    'should properly render error UI with title:$title and corresponding message',
    ({ code, title: errorTitle }) => {
      const { getByText } = setup({ code, errorTitle, errorMessage })

      const titleNode = getByText(errorTitle)
      const messageNode = getByText(errorMessage)

      expect(titleNode).toBeVisible()
      expect(messageNode).toBeVisible()
    }
  )
})
