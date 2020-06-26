import { calculatePollResult, CalculatePollResultRequest } from '~/simulation/services/calculatePollResult';
import { PollResult } from '~/simulation/types/PollResult';
import { Round } from '~/simulation/types/Round';
import { OptionVoteResult } from '~/simulation/types/OptionVoteResult';

describe('poll results calculator', () => {
    it('single round', () => {
        const calculatePollResultRequest = {
            options: [
                {
                    optionId: 1,
                    label: 'Blue',
                },
                {
                    optionId: 2,
                    label: 'Red',
                },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 2,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 3,
                    choices: [
                        {
                            optionId: 2,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        const expectedPollResult = {
            rounds: [
                {
                    roundId: 1,
                    optionVoteResults: [
                        {
                            optionId: 2,
                            voteCount: 2,
                        },
                        {
                            optionId: 1,
                            voteCount: 1,
                        },
                    ],
                },
            ],
        };

        testMacro({ calculatePollResultRequest, expectedPollResult });
    });

    it('two rounds, three candidates', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                {
                    optionId: 1,
                    label: 'Red',
                },
                {
                    optionId: 2,
                    label: 'Blue',
                },
                {
                    optionId: 3,
                    label: 'Yellow',
                },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 2,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 3,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 4,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 5,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 6,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 7,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 8,
                    choices: [
                        { optionId: 3, orderId: 1 },
                        { optionId: 2, orderId: 1 },
                    ],
                },
                {
                    voterId: 9,
                    choices: [
                        { optionId: 3, orderId: 1 },
                        { optionId: 2, orderId: 1 },
                    ],
                },
            ],
        };

        const expectedPollResult: PollResult = {
            rounds: [
                {
                    roundId: 1,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 4 },
                        { optionId: 2, voteCount: 3 },
                        { optionId: 3, voteCount: 2 },
                    ],
                },
                {
                    roundId: 2,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 4 },
                        { optionId: 2, voteCount: 5 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculatePollResultRequest, expectedPollResult });
    });

    it('plurality instead of majority', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                {
                    optionId: 1,
                    label: 'Red',
                },
                {
                    optionId: 2,
                    label: 'Blue',
                },
                {
                    optionId: 3,
                    label: 'Yellow',
                },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 2,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 3,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 5,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 6,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 8,
                    choices: [{ optionId: 3, orderId: 1 }],
                },
            ],
        };

        const expectedPollResult: PollResult = {
            rounds: [
                {
                    roundId: 1,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 3 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 1 },
                    ],
                },
                {
                    roundId: 2,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 3 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculatePollResultRequest, expectedPollResult });
    });

    it('tie between two candidates', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                {
                    optionId: 1,
                    label: 'Red',
                },
                {
                    optionId: 2,
                    label: 'Blue',
                },
                {
                    optionId: 3,
                    label: 'Yellow',
                },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 2,
                    choices: [{ optionId: 1, orderId: 1 }],
                },
                {
                    voterId: 5,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 6,
                    choices: [{ optionId: 2, orderId: 1 }],
                },
                {
                    voterId: 8,
                    choices: [{ optionId: 3, orderId: 1 }],
                },
            ],
        };

        const expectedPollResult: PollResult = {
            rounds: [
                {
                    roundId: 1,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 2 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 1 },
                    ],
                },
                {
                    roundId: 2,
                    optionVoteResults: [
                        { optionId: 1, voteCount: 2 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculatePollResultRequest, expectedPollResult });
    });

    it('throws when there are no options', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [],
            votes: [
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'Expected option list to contain at least two options but it contained 0.',
        );
    });

    it('throws when there is only 1 option', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [{ optionId: 1, label: 'Red' }],
            votes: [
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'Expected option list to contain at least two options but it contained 1.',
        );
    });

    it('throws when there are no votes', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                { optionId: 1, label: 'Red' },
                { optionId: 2, label: 'Blue' },
            ],
            votes: [],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'Expected vote list to contain at least one vote but it contained 0.',
        );
    });

    it('throws when a vote was made for an option that does not exist', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                { optionId: 1, label: 'Red' },
                { optionId: 2, label: 'Blue' },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 3,
                            orderId: 1,
                        },
                        {
                            optionId: 4,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'Votes were cast for optionIds {3, 4}, but those optionIds did not exist in the option list.',
        );
    });

    it('throws there are multiple options with the same optionId', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                { optionId: 1, label: 'Red' },
                { optionId: 2, label: 'Blue' },
                { optionId: 2, label: 'Yellow' },
                { optionId: 3, label: 'Green' },
                { optionId: 3, label: 'Orange' },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'There are multiple options for the following optionIds: {2, 3}, but optionIds must be distinct across options.',
        );
    });

    it('throws when there are multiple voters with the same voterId', () => {
        const calculatePollResultRequest: CalculatePollResultRequest = {
            options: [
                { optionId: 1, label: 'Red' },
                { optionId: 2, label: 'Blue' },
            ],
            votes: [
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
                {
                    voterId: 1,
                    choices: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => calculatePollResult(calculatePollResultRequest)).toThrowError(
            'There are multiple voters for the following voterIds: {1}, but voterIds must be distinct across voters.',
        );
    });
});

interface TestArgument {
    calculatePollResultRequest: CalculatePollResultRequest;
    expectedPollResult: PollResult;
}

const testMacro = (testArgument: TestArgument): void => {
    const actualPollResult = calculatePollResult(testArgument.calculatePollResultRequest);
    expect(sortedByRoundIdOptionId(actualPollResult)).toEqual(sortedByRoundIdOptionId(testArgument.expectedPollResult));
};

const sortedByRoundIdOptionId = (pollResult: PollResult): PollResult => ({
    rounds: pollResult.rounds
        .sort(byRoundId)
        .map(r => ({ roundId: r.roundId, optionVoteResults: r.optionVoteResults.sort(byOptionId) })),
});

const byRoundId = (a: Round, b: Round) => (a.roundId < b.roundId ? -1 : 1);

const byOptionId = (a: OptionVoteResult, b: OptionVoteResult) => (a.optionId < b.optionId ? -1 : 1);
