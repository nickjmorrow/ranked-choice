import { Test, TestingModule } from '@nestjs/testing';
import { CalculateQuestionResultRequest, PollResultCalculationService } from './poll-result-calculation.service';
import { Round } from '~/poll-result-calculation/types/Round';
import { OptionResult } from '~/poll-result-calculation/types/OptionResult';
import { QuestionResult } from '~/poll-result-calculation/types/QuestionResult';

interface TestArgument {
    calculateQuestionResultRequest: CalculateQuestionResultRequest;
    expectedQuestionResult: QuestionResult;
    pollResultCalculationService: PollResultCalculationService;
}

const byRoundId = (a: Round, b: Round) => (a.roundId < b.roundId ? -1 : 1);

const byOptionId = (a: OptionResult, b: OptionResult) => (a.optionId < b.optionId ? -1 : 1);
const sortedByRoundIdOptionId = (questionResult: QuestionResult): QuestionResult => ({
    rounds: questionResult.rounds
        .sort(byRoundId)
        .map(r => ({ roundId: r.roundId, optionResults: r.optionResults.sort(byOptionId) })),
});

const testMacro = (testArgument: TestArgument): void => {
    const { pollResultCalculationService } = testArgument;
    const actualQuestionResult = pollResultCalculationService.calculateQuestionResult(
        testArgument.calculateQuestionResultRequest,
    );
    expect(sortedByRoundIdOptionId(actualQuestionResult)).toEqual(
        sortedByRoundIdOptionId(testArgument.expectedQuestionResult),
    );
};

describe('PollResultCalculationService', () => {
    let pollResultCalculationService: PollResultCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PollResultCalculationService],
        }).compile();

        pollResultCalculationService = module.get<PollResultCalculationService>(PollResultCalculationService);
    });

    it('should be defined', () => {
        expect(pollResultCalculationService).toBeDefined();
    });

    it('single round', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2],

            votes: [
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [
                        {
                            optionId: 2,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        const expectedQuestionResult: QuestionResult = {
            rounds: [
                {
                    roundId: 1,
                    optionResults: [
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

        testMacro({
            calculateQuestionResultRequest,
            expectedQuestionResult,
            pollResultCalculationService: pollResultCalculationService,
        });
    });

    it('two rounds, three candidates', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2, 3],
            votes: [
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [
                        { optionId: 3, orderId: 1 },
                        { optionId: 2, orderId: 1 },
                    ],
                },
                {
                    rankedOptions: [
                        { optionId: 3, orderId: 1 },
                        { optionId: 2, orderId: 1 },
                    ],
                },
            ],
        };

        const expectedQuestionResult: QuestionResult = {
            rounds: [
                {
                    roundId: 1,
                    optionResults: [
                        { optionId: 1, voteCount: 4 },
                        { optionId: 2, voteCount: 3 },
                        { optionId: 3, voteCount: 2 },
                    ],
                },
                {
                    roundId: 2,
                    optionResults: [
                        { optionId: 1, voteCount: 4 },
                        { optionId: 2, voteCount: 5 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculateQuestionResultRequest, expectedQuestionResult, pollResultCalculationService });
    });

    it('plurality instead of majority', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2, 3],
            votes: [
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 3, orderId: 1 }],
                },
            ],
        };

        const expectedQuestionResult: QuestionResult = {
            rounds: [
                {
                    roundId: 1,
                    optionResults: [
                        { optionId: 1, voteCount: 3 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 1 },
                    ],
                },
                {
                    roundId: 2,
                    optionResults: [
                        { optionId: 1, voteCount: 3 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculateQuestionResultRequest, expectedQuestionResult, pollResultCalculationService });
    });

    it('tie between two candidates', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2, 3],
            votes: [
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 1, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 2, orderId: 1 }],
                },
                {
                    rankedOptions: [{ optionId: 3, orderId: 1 }],
                },
            ],
        };

        const expectedQuestionResult: QuestionResult = {
            rounds: [
                {
                    roundId: 1,
                    optionResults: [
                        { optionId: 1, voteCount: 2 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 1 },
                    ],
                },
                {
                    roundId: 2,
                    optionResults: [
                        { optionId: 1, voteCount: 2 },
                        { optionId: 2, voteCount: 2 },
                        { optionId: 3, voteCount: 0 },
                    ],
                },
            ],
        };

        testMacro({ calculateQuestionResultRequest, expectedQuestionResult, pollResultCalculationService });
    });

    it('throws when there are no options', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [],
            votes: [
                {
                    rankedOptions: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => pollResultCalculationService.calculateQuestionResult(calculateQuestionResultRequest)).toThrowError(
            'Expected option list to contain at least two options but it contained 0.',
        );
    });

    it('throws when there is only 1 option', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1],
            votes: [
                {
                    rankedOptions: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => pollResultCalculationService.calculateQuestionResult(calculateQuestionResultRequest)).toThrowError(
            'Expected option list to contain at least two options but it contained 1.',
        );
    });

    it('throws when there are no votes', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2],
            votes: [],
        };

        expect(() => pollResultCalculationService.calculateQuestionResult(calculateQuestionResultRequest)).toThrowError(
            'Expected vote list to contain at least one vote but it contained 0.',
        );
    });

    it('throws when a vote was made for an option that does not exist', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [7, 8],
            votes: [
                {
                    rankedOptions: [
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

        expect(() => pollResultCalculationService.calculateQuestionResult(calculateQuestionResultRequest)).toThrowError(
            'Votes were cast for optionIds {3, 4}, but those optionIds did not exist in the option list.',
        );
    });

    it('throws there are multiple options with the same optionId', () => {
        const calculateQuestionResultRequest: CalculateQuestionResultRequest = {
            optionIds: [1, 2, 2, 3, 3],
            votes: [
                {
                    rankedOptions: [
                        {
                            optionId: 1,
                            orderId: 1,
                        },
                    ],
                },
            ],
        };

        expect(() => pollResultCalculationService.calculateQuestionResult(calculateQuestionResultRequest)).toThrowError(
            'There are multiple options for the following optionIds: {2, 3}, but optionIds must be distinct across options.',
        );
    });
});
