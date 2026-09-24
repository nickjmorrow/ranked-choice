/**
 * The API's wire types. Mirror `backend/src/polls/polls.views.ts` and
 * `backend/src/tally/tally.ts`; keep the field order the same so the two read
 * side by side.
 */

export interface OptionCount {
  optionId: number;
  votes: number;
}

export interface Round {
  round: number;
  /** One entry per option still in the race, most votes first. */
  counts: OptionCount[];
  /** Votes still counting this round: the denominator for a majority. */
  continuingVotes: number;
  /** Ballots with no continuing option left on them. */
  exhausted: number;
  /** Options eliminated at the end of this round. Empty in the final round. */
  eliminated: number[];
}

export type Outcome =
  | { kind: 'no-votes' }
  | { kind: 'tie'; optionIds: number[]; round: number }
  | { kind: 'winner'; optionId: number; round: number };

export interface Tally {
  rounds: Round[];
  outcome: Outcome;
  /** Ballots that ranked at least one option. */
  ballots: number;
}

export interface Option {
  optionId: number;
  label: string;
  sublabel: string | null;
}

export interface Question {
  questionId: number;
  content: string;
  subheading: string | null;
  isRequired: boolean;
  options: Option[];
}

export interface Poll {
  link: string;
  title: string;
  description: string | null;
  questions: Question[];
}

export interface PollResults {
  poll: Poll;
  ballots: number;
  questions: { questionId: number; tally: Tally }[];
}

export interface Meta {
  /** Set on the public demo, where visitors' polls are deleted after this many days. */
  pollRetentionDays: null | number;
}

export interface NewPoll {
  title: string;
  description: string | null;
  questions: {
    content: string;
    subheading: string | null;
    options: { label: string; sublabel: string | null }[];
  }[];
}

export interface BallotRequest {
  rankings: { questionId: number; optionIds: number[] }[];
}

export interface TallyRequest {
  optionIds: number[];
  ballots: { ranking: number[]; count: number }[];
}
