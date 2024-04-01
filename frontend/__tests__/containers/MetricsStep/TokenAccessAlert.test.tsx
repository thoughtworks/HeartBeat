import { AUTHORIZE_ORGANIZATION_LINK, GENERATE_GITHUB_TOKEN_LINK } from '@src/constants/resources';
import { TokenAccessAlert, AlertTextContent } from '@src/containers/MetricsStep/TokenAccessAlert';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

describe('TokenAccessAlert', () => {
  it('should render alert with errorDetail 400', () => {
    render(<TokenAccessAlert errorDetail={400} />);

    const changeTokenText = screen.queryByText('Limited access token:');
    const linkElement = screen.getByRole('link', { name: /correct access permission/i });

    expect(screen.getByLabelText('alert for token access error')).toBeInTheDocument();
    expect(changeTokenText).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('should not render alert when errorDetail is 404', () => {
    const { container } = render(<TokenAccessAlert errorDetail={404} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render with errorDetail 401', () => {
    const { getByText, getByRole } = render(<TokenAccessAlert errorDetail={401} />);
    const limitedAccessText = getByText('Unauthorized token:');
    const link = getByRole('link');

    expect(limitedAccessText).toBeInTheDocument();
    expect(link).toHaveAttribute('href', AUTHORIZE_ORGANIZATION_LINK);
    expect(link).toHaveTextContent('correct organization');
  });
});

describe('AlertTextContent', () => {
  it('should render for errorDetail 401', () => {
    const { getByText, getByRole } = render(<AlertTextContent errorDetail={401} />);
    const unauthorizedText = getByText('Unauthorized token:');
    const link = getByRole('link');

    expect(unauthorizedText).toBeInTheDocument();
    expect(link).toHaveAttribute('href', AUTHORIZE_ORGANIZATION_LINK);
    expect(link).toHaveTextContent('correct organization');
  });

  it('should render for errorDetail 400', () => {
    const { getByText, getByRole } = render(<AlertTextContent errorDetail={400} />);
    const limitedAccessText = getByText('Limited access token:');
    const link = getByRole('link');

    expect(limitedAccessText).toBeInTheDocument();
    expect(link).toHaveAttribute('href', GENERATE_GITHUB_TOKEN_LINK);
    expect(link).toHaveTextContent('correct access permission');
  });
  it('does not render anything for other errorDetail', () => {
    const { container } = render(<AlertTextContent errorDetail={500} />);
    expect(container.firstChild).toBeNull();
  });
});
