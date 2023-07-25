import '@testing-library/jest-dom'
export const navigateMock = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => navigateMock,
}))
