import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from '../utils/setupStoreUtil'
import { useGetPipelineToolInfoEffect } from '@src/hooks/useGetPipelineToolInfoEffect'
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient'
import { MOCK_BUILD_KITE_GET_INFO_RESPONSE } from '../fixtures'
import { HttpStatusCode } from 'axios'
import { ReactNode } from 'react'
import { RootState } from '@src/store'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: <TSelected>(state: RootState) => TSelected) => {
    const originalUseSelector = jest.requireActual('react-redux').useSelector
    if (selector.name === 'isPipelineToolVerified') {
      return true
    } else {
      return originalUseSelector(selector)
    }
  },
}))

const store = setupStore()
const Wrapper = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>
}

const clientSpy = jest.fn()
const clientOkMock = jest.fn().mockImplementation(() => {
  clientSpy()
  const response = {
    code: HttpStatusCode.Ok,
    data: MOCK_BUILD_KITE_GET_INFO_RESPONSE,
    errorTittle: '',
    errorMessage: '',
  }
  return Promise.resolve(response)
})

beforeEach(() => {
  pipelineToolClient.getPipelineToolInfo = clientOkMock
  clientSpy.mockClear()
})

describe('use get pipelineTool info side effect', () => {
  it('should properly return data and loading state when client works properly', async () => {
    const { result } = renderHook(() => useGetPipelineToolInfoEffect(), { wrapper: Wrapper })
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
    })

    expect(clientSpy).toBeCalled()
  })

  it('should not make duplicated call when hook rerenders', async () => {
    const { result, rerender } = renderHook(() => useGetPipelineToolInfoEffect(), { wrapper: Wrapper })
    rerender()

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
    })

    expect(clientSpy).toBeCalledTimes(1)
  })

  it('should log error when error happens', async () => {
    const clientErrorMock = jest.fn().mockImplementation(() => {
      clientSpy()
      const error = {
        code: 401,
        message: 'Unauthorized',
      }
      return Promise.reject(error)
    })
    const consoleErrorSpy = jest.spyOn(console, 'error')
    pipelineToolClient.getPipelineToolInfo = clientErrorMock

    const { result } = renderHook(() => useGetPipelineToolInfoEffect(), { wrapper: Wrapper })
    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to get pipeline tool info in useGetPipelineToolInfoEffect hook',
      'Unauthorized'
    )
  })
})
