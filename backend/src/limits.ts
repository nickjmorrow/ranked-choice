/**
 * Every size the API accepts, in one place. The text lengths match the column
 * widths in the migrations, so a request that validates always fits.
 */
export const LIMITS = {
  titleLength: 255,
  descriptionLength: 2000,
  questionsPerPoll: 20,
  questionLength: 255,
  optionsPerQuestion: 20,
  optionLength: 255,
  /** The simulator's ballot groups: how many, and voters per group. */
  ballotGroups: 100,
  votersPerBallotGroup: 10_000,
} as const;
