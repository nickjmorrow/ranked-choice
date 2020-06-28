import { PollCreationState } from '~/poll-creation/types/PollCreationState';

interface AppState {
    pollCreationState: PollCreationState;
}

const getPollCreationState = (state: AppState) => state.pollCreationState;

export const pollCreationSelectors = { getPollCreationState };
