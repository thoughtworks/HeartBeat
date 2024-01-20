import EllipsisText from '@src/components/Common/EllipsisText';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('EllipsisText', () => {
  const WIDTH = '500rem';

  it('should forward ref properly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <EllipsisText fitContent>
        <div aria-label='test-ref' ref={ref}>
          test
        </div>
      </EllipsisText>,
    );

    const childDOM = screen.getByLabelText('test-ref');
    expect(ref.current).toEqual(childDOM);
  });

  it('should apply fit-content as its width when `fitContent` specified', async () => {
    render(
      <div style={{ width: WIDTH }}>
        <EllipsisText aria-label='test-ellipsis-text' fitContent>
          <div>test</div>
        </EllipsisText>
      </div>,
    );

    const targetElement = screen.getByLabelText('test-ellipsis-text');
    expect(targetElement).toHaveStyle({ width: 'fit-content' });
  });

  it('should apply fit-content as its width when `fitContent` explicitly set to false', async () => {
    render(
      <div style={{ width: WIDTH }}>
        <EllipsisText aria-label='test-ellipsis-text' fitContent={false}>
          <div>test</div>
        </EllipsisText>
      </div>,
    );

    const targetElement = screen.getByLabelText('test-ellipsis-text');
    expect(targetElement).toHaveStyle({ width: 'auto' });
  });
});
