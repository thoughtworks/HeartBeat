import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';

export const navigateMock = jest.fn();

// This configuration will affect the waitFor default timeout which is 1000ms.
configure({ asyncUtilTimeout: 2000 });

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => navigateMock,
}));
