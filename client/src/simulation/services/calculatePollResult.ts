import { PollResult } from '~/simulation/types/PollResult';
import { Vote } from '~/simulation/types/Vote';
import { Option } from '~/simulation/types/Option';
import { Choice } from '~/simulation/types/Choice';
import { Round } from '~/simulation/types/Round';

export interface CalculatePollResultRequest {
    options: Option[];
    votes: Vote[];
}

const validateCalculatePollResultRequest = (calculatePollResultRequest: CalculatePollResultRequest) => {
    const { options, votes } = calculatePollResultRequest;

    if (options.length < 2) {
        throw new Error(`Expected option list to contain at least two options but it contained ${options.length}.`);
    }

    if (votes.length === 0) {
        throw new Error('Expected vote list to contain at least one vote but it contained 0.');
    }

    const optionIds = options.map(o => o.optionId);
    const invalidVotes = votes
        .map(v => v.choices.map(c => c.optionId))
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
    options.forEach(({ optionId }) => {
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

    const seenVoterIds = new Set<number>();
    const alreadySeenVoterIds = new Set<number>();

    votes.forEach(({ voterId }) => {
        if (seenVoterIds.has(voterId)) {
            alreadySeenVoterIds.add(voterId);
        }

        seenVoterIds.add(voterId);
    });

    if (alreadySeenVoterIds.size > 0) {
        throw new Error(
            `There are multiple voters for the following voterIds: {${[...alreadySeenVoterIds].join(
                ', ',
            )}}, but voterIds must be distinct across voters.`,
        );
    }
};

export const calculatePollResult = (argument: CalculatePollResultRequest): PollResult => {
    validateCalculatePollResultRequest(argument);
    const { options, votes } = argument;

    let roundId = 1;
    let pollResult: PollResult = {
        rounds: [],
    };

    let validCandidates = new Map<number, boolean>();
    options.forEach(o => validCandidates.set(o.optionId, true));

    const byOrderId = (a: Choice, b: Choice) => (a.orderId < b.orderId ? -1 : 1);

    const toValidCandidates = (choice: Choice) => validCandidates.has(choice.optionId);

    const getInitialRoundResults = () => options.map(o => ({ optionId: o.optionId, voteCount: 0 }));

    while (true) {
        const roundResults = getInitialRoundResults();

        votes.forEach(vote => {
            let orderedChoices = vote.choices.sort(byOrderId).filter(toValidCandidates);
            if (orderedChoices.length === 0) {
                return;
            }
            const choice = orderedChoices[0];
            roundResults.find(rr => rr.optionId === choice.optionId)!.voteCount += 1;
        });

        const round = { roundId, optionVoteResults: roundResults };
        pollResult.rounds.push(round);

        if (isMajorityOfRemainingVotesReached(round) || hasTied(round)) {
            break;
        }

        roundId += 1;

        removeFewestVotedCandidates(round, validCandidates);

        if (roundId > options.length) {
            throw new Error('RoundId exceeds number of available options. Infinite loop has likely occurred.');
        }
    }

    return pollResult;
};

const isMajorityOfRemainingVotesReached = (round: Round): boolean => {
    const { optionVoteResults } = round;
    const totalVotes = optionVoteResults.reduce((agg, cur) => agg + cur.voteCount, 0);
    return optionVoteResults.some(r => r.voteCount / totalVotes > 0.5);
};

const hasTied = (round: Round): boolean => {
    const { optionVoteResults } = round;
    const max = optionVoteResults.reduce((agg, cur) => Math.max(agg, cur.voteCount), -Infinity);
    const result = !optionVoteResults.filter(r => r.voteCount !== 0).some(r => r.voteCount !== max);

    return result;
};

const removeFewestVotedCandidates = (round: Round, validCandidates: Map<number, boolean>) => {
    const { optionVoteResults } = round;
    const fewestVotes = optionVoteResults.reduce((agg, cur) => Math.min(agg, cur.voteCount), Infinity);
    round.optionVoteResults.filter(r => r.voteCount === fewestVotes).forEach(r => validCandidates.delete(r.optionId));
};
