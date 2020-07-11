import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { PollVotingActionTypeKeys, pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { pollVotingInitialState } from '~/poll-voting/state/pollVotingInitialState';
import { PollVotingState } from '~/poll-voting/types/PollVotingState';

export const pollVotingReducer = (
    state: PollVotingState = pollVotingInitialState,
    action: ActionType<typeof pollVotingActions>,
): PollVotingState => {
    switch (action.type) {
        case PollVotingActionTypeKeys.GET_POLL_SUCCESS:
            return produce(state, draftState => {
                draftState.poll = action.payload;
            });
        default:
            return state;
    }
};
