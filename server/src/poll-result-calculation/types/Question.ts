import { Vote } from '~/poll-result-calculation/types/Vote';

export interface Question {
    optionIds: number[];
    votes: Vote[];
}
