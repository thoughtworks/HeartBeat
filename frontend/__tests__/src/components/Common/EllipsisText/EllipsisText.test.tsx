import React from 'react';
import { render } from '@testing-library/react';
import EllipsisText from '@src/components/Common/EllipsisText';

describe('EllipsisText', () => {
  const WIDTH = '500rem';

  it('should forward ref properly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    const { getByLabelText } = render(
      <EllipsisText fitContent>
        <div aria-label='test-ref' ref={ref}>
          test
        </div>
      </EllipsisText>
    );

    const childDOM = getByLabelText('test-ref');
    expect(ref.current).toEqual(childDOM);
  });

  it('should apply fit-content as its width when `fitContent` specified', async () => {
    const { getByLabelText } = render(
      <div style={{ width: WIDTH }}>
        <EllipsisText aria-label='test-ellipsis-text' fitContent>
          <div>test</div>
        </EllipsisText>
      </div>
    );

    const targetElement = getByLabelText('test-ellipsis-text');
    expect(targetElement).toHaveStyle({ width: 'fit-content' });
  });

  it('should apply fit-content as its width when `fitContent` explicitly set to false', async () => {
    const { getByLabelText } = render(
      <div style={{ width: WIDTH }}>
        <EllipsisText aria-label='test-ellipsis-text' fitContent={false}>
          <div>test</div>
        </EllipsisText>
      </div>
    );

    const targetElement = getByLabelText('test-ellipsis-text');
    expect(targetElement).toHaveStyle({ width: 'auto' });
  });
});
