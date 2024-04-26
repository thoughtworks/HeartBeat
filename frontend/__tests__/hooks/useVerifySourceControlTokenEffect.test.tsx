import { useVerifySourceControlTokenEffect } from '@src/hooks/useVerifySourceControlTokenEffect';
import { sourceControlDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { MOCK_PIPELINE_VERIFY_UNAUTHORIZED_TEXT, UNKNOWN_ERROR_TEXT } from '../fixtures';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { sourceControlSchema } from '@src/containers/ConfigStep/Form/schema';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { FormProvider } from '@test/utils/FormProvider';
import { setupStore } from '../utils/setupStoreUtil';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';
import { ReactNode } from 'react';

const setErrorSpy = jest.fn();
const resetSpy = jest.fn();

jest.mock('react-hook-form', () => {
  return {
    ...jest.requireActual('react-hook-form'),
    useFormContext: () => {
      const { useFormContext } = jest.requireActual('react-hook-form');
      const originals = useFormContext();
      return {
        ...originals,
        setError: (...args: [string, { message: string }]) => setErrorSpy(...args),
        reset: (...args: [string, { message: string }]) => resetSpy(...args),
      };
    },
  };
});

const HookWrapper = ({ children }: { children: ReactNode }) => {
  const store = setupStore();
  return (
    <Provider store={store}>
      <FormProvider defaultValues={sourceControlDefaultValues} schema={sourceControlSchema}>
        {children}
      </FormProvider>
    </Provider>
  );
};

describe('use verify sourceControl token', () => {
  const setup = () => {
    const { result } = renderHook(useVerifySourceControlTokenEffect, { wrapper: HookWrapper });

    return { result };
  };

  it('should keep verified values when call verify function given a valid token', async () => {
    const { result } = setup();
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: HttpStatusCode.NoContent,
    });

    await result.current.verifyToken();

    expect(resetSpy).toHaveBeenCalledWith(
      {
        type: 'GitHub',
        token: '',
      },
      { keepValues: true },
    );
  });

  const errorScenarios = [
    {
      mock: {
        code: HttpStatusCode.Unauthorized,
        errorTitle: MOCK_PIPELINE_VERIFY_UNAUTHORIZED_TEXT,
      },
      field: 'token',
      status: '401',
      message: 'Token is incorrect!',
    },
    {
      mock: {
        code: HttpStatusCode.ServiceUnavailable,
        errorTitle: UNKNOWN_ERROR_TEXT,
      },
      field: 'token',
      status: 'Unknown',
      message: 'Unknown error',
    },
    {
      mock: {
        code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT,
        errorTitle: '',
      },
      field: 'token',
      status: 'Timeout',
      message: 'Timeout!',
    },
  ];

  it.each(errorScenarios)(
    'should set $field error message when verifying pipeline given response status',
    async ({ mock, field, message }) => {
      sourceControlClient.verifyToken = jest.fn().mockResolvedValue(mock);

      const { result } = setup();
      await result.current.verifyToken();

      expect(setErrorSpy).toHaveBeenCalledWith(field, { message });
    },
  );

  it('should clear all verified error messages when call resetFeilds', async () => {
    const { result } = setup();

    result.current.resetFields();

    expect(resetSpy).toHaveBeenCalledWith({
      type: 'GitHub',
      token: '',
    });
  });
});
