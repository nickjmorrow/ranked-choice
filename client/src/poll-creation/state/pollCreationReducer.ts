import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { PollCreationState } from '~/poll-creation/types/PollCreationState';
import { pollCreationInitialState } from '~/poll-creation/state/pollCreationInitialState';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';

export const pollCreationReducer = (
    state: PollCreationState = pollCreationInitialState,
    action: ActionType<typeof pollCreationActions>,
): PollCreationState => {
    switch (action.type) {
        default:
            return state;
    }
};
