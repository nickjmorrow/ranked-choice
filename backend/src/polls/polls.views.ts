import type { Tally } from '../tally/tally';

/**
 * What the API returns. Entities are mapped to these explicitly rather than
 * serialised as they are, so a column added to a table is not published by
 * accident — and the internal `pollId` never leaves the server.
 */

export interface OptionView {
  optionId: number;
  label: string;
  sublabel: string | null;
}

export interface QuestionView {
  questionId: number;
  content: string;
  subheading: string | null;
  isRequired: boolean;
  options: OptionView[];
}

export interface PollView {
  link: string;
  title: string;
  description: string | null;
  questions: QuestionView[];
}

export interface PollResultsView {
  poll: PollView;
  /** Ballots cast on the poll as a whole. */
  ballots: number;
  questions: { questionId: number; tally: Tally }[];
}

export interface CreatedPollView {
  link: string;
}
