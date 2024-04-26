import { BOARD_TYPES } from '@src/constants/resources';

export interface IBoardVerifyResponseState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[];
  targetFields: { name: string; key: string; flag: boolean }[];
  users: string[];
}
export interface IBoardState {
  config: {
    type: string;
    boardId: string;
    email: string;
    projectKey: string;
    site: string;
    token: string;
  };
  isShow: boolean;
  verifiedResponse: IBoardVerifyResponseState;
}

export const initialVerifiedBoardState: IBoardVerifyResponseState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
};

export const initialBoardState: IBoardState = {
  config: {
    type: BOARD_TYPES.JIRA,
    boardId: '',
    email: '',
    projectKey: '',
    site: '',
    token: '',
  },
  isShow: false,
  verifiedResponse: initialVerifiedBoardState,
};
