import { ActionType } from 'typesafe-actions';
import { pollResultActions, PollResultActionTypeKeys } from '~/poll-results/state/pollResultActions';
import { pollResultInitialState } from '~/poll-results/state/pollResultInitialState';
import { PollResultState } from '~/poll-results/types/PollResultState';
import produce from 'immer';

export const pollResultsReducer = (
    state: PollResultState = pollResultInitialState,
    action: ActionType<typeof pollResultActions>,
): PollResultState => {
    switch (action.type) {
        case PollResultActionTypeKeys.GET_POLL_RESULT_SUCCESS:
            return produce(state, draftState => {
                draftState.pollResult = action.payload;
            });
        default:
            return state;
    }
};
