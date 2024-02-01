import { UserEvent } from '@testing-library/user-event/setup/setup';
import userEvent from '@testing-library/user-event/index';

export const closeMuiModal = (ue: typeof userEvent | UserEvent) => ue.keyboard('{Escape}');
