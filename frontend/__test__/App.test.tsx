import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('render app', () => {
  it('should show hello World', () => {
    const { getByText } = render(<App />);

    const text = getByText('Hello World');
    expect(text).toBeInTheDocument();
  });
});
