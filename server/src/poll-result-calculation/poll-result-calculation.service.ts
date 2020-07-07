import { Injectable } from '@nestjs/common';
import { Poll } from '~/poll-result-calculation/types/Poll';
import { PollResult } from '~/poll-result-calculation/types/PollResult';
import { Vote } from '~/poll-result-calculation/types/Vote';
import { QuestionResult } from '~/poll-result-calculation/types/QuestionResult';
import { RankedOption } from '~/poll-result-calculation/types/RankedOption';
import { Round } from '~/poll-result-calculation/types/Round';

export interface CalculatePollResultRequest {
    poll: Poll;
}

export interface CalculateQuestionResultRequest {
    optionIds: number[];
    votes: Vote[];
}

@Injectable()
export class PollResultCalculationService {
    public calculatePollResult = (request: CalculatePollResultRequest): PollResult => {
        const {
            poll: { questions },
        } = request;

        const questionResults = questions.map(({ optionIds, votes }) =>
            this.calculateQuestionResult({ optionIds, votes }),
        );

        return { questionResults };
    };

    public calculateQuestionResult = (request: CalculateQuestionResultRequest): QuestionResult => {
        this.validateCalculateQuestionResultRequest(request);

        const { optionIds, votes } = request;

        let roundId = 1;
        const questionResult: QuestionResult = {
            rounds: [],
        };

        const validCandidates = new Map<number, boolean>();
        optionIds.forEach(o => validCandidates.set(o, true));

        const byOrderId = (a: RankedOption, b: RankedOption) => (a.orderId < b.orderId ? -1 : 1);

        const toValidCandidates = (choice: RankedOption) => validCandidates.has(choice.optionId);

        const getInitialRoundResults = () => optionIds.map(o => ({ optionId: o, voteCount: 0 }));

        while (true) {
            const optionResults = getInitialRoundResults();

            votes.forEach(vote => {
                const orderedChoices = vote.rankedOptions
                    .slice()
                    .sort(byOrderId)
                    .filter(toValidCandidates);
                if (orderedChoices.length === 0) {
                    return;
                }
                const choice = orderedChoices[0];
                optionResults.find(rr => rr.optionId === choice.optionId)!.voteCount += 1;
            });

            const round: Round = { roundId, optionResults };
            questionResult.rounds.push(round);

            if (this.isMajorityOfRemainingVotesReached(round) || this.hasTied(round)) {
                break;
            }

            roundId += 1;

            this.removeFewestVotedCandidates(round, validCandidates);

            if (roundId > optionIds.length) {
                throw new Error('RoundId exceeds number of available options. Infinite loop has likely occurred.');
            }
        }

        return questionResult;
    };

    private validateCalculateQuestionResultRequest = (
        calculateQuestionResultRequest: CalculateQuestionResultRequest,
    ) => {
        const { optionIds, votes } = calculateQuestionResultRequest;

        if (optionIds.length < 2) {
            throw new Error(
                `Expected option list to contain at least two options but it contained ${optionIds.length}.`,
            );
        }

        if (votes.length === 0) {
            throw new Error('Expected vote list to contain at least one vote but it contained 0.');
        }

        const invalidVotes = votes
            .map(v => v.rankedOptions.map(c => c.optionId))
            .flat()
            .filter(v => !optionIds.includes(v));
        if (invalidVotes.length > 0) {
            throw new Error(
                `Votes were cast for optionIds {${invalidVotes
                    .sort()
                    .join(', ')}}, but those optionIds did not exist in the option list.`,
            );
        }

        const seenOptionIds = new Set<number>();
        const alreadySeenOptionIds = new Set<number>();
        optionIds.forEach(optionId => {
            if (seenOptionIds.has(optionId)) {
                alreadySeenOptionIds.add(optionId);
            }
            seenOptionIds.add(optionId);
        });

        if (alreadySeenOptionIds.size > 0) {
            throw new Error(
                `There are multiple options for the following optionIds: {${[...alreadySeenOptionIds].join(
                    ', ',
                )}}, but optionIds must be distinct across options.`,
            );
        }
    };

    private removeFewestVotedCandidates = (round: Round, validCandidates: Map<number, boolean>) => {
        const { optionResults: results } = round;
        const fewestVotes = results.reduce((agg, cur) => Math.min(agg, cur.voteCount), Infinity);
        round.optionResults.filter(r => r.voteCount === fewestVotes).forEach(r => validCandidates.delete(r.optionId));
    };

    private hasTied = (round: Round): boolean => {
        const { optionResults: results } = round;
        const max = results.reduce((agg, cur) => Math.max(agg, cur.voteCount), -Infinity);
        const result = !results.filter(r => r.voteCount !== 0).some(r => r.voteCount !== max);

        return result;
    };

    private isMajorityOfRemainingVotesReached = (round: Round): boolean => {
        const { optionResults: results } = round;
        const totalVotes = results.reduce((agg, cur) => agg + cur.voteCount, 0);
        return results.some(r => r.voteCount / totalVotes > 0.5);
    };
}
