import { describe, expect, it } from 'vitest';
import {
  blankQuestion,
  emptyDraft,
  isBlank,
  nextKey,
  optionFieldId,
  parseDraft,
  type PollDraft,
  questionFieldId,
  TITLE_ID,
  toNewPoll,
  validateDraft,
} from 'src/pollForm';

const filled = (): PollDraft => ({
  description: '  ',
  questions: [
    {
      content: ' Where should we eat? ',
      key: 1,
      options: [
        { key: 2, label: ' Tacos ', sublabel: '' },
        { key: 3, label: 'Ramen', sublabel: ' Downtown ' },
      ],
      subheading: '',
    },
  ],
  title: ' Lunch ',
});

describe('validateDraft', () => {
  it('accepts a complete draft', () => {
    expect(validateDraft(filled())).toEqual([]);
  });

  it('points at every missing field, in order', () => {
    expect(validateDraft(emptyDraft())).toEqual([
      { fieldId: TITLE_ID, message: 'Give the poll a title.' },
      { fieldId: questionFieldId(1), message: 'Question 1 needs a prompt.' },
      {
        fieldId: optionFieldId(1, 2),
        message: 'Question 1, option 1 needs a label, or remove it.',
      },
      {
        fieldId: optionFieldId(1, 3),
        message: 'Question 1, option 2 needs a label, or remove it.',
      },
    ]);
  });

  it('catches an option listed twice, ignoring case and spacing', () => {
    const draft = filled();
    draft.questions[0]!.options[1]!.label = 'tacos  ';
    expect(validateDraft(draft)).toEqual([
      { fieldId: optionFieldId(1, 3), message: 'Question 1 lists “tacos” twice.' },
    ]);
  });

  it('needs two options per question', () => {
    const draft = filled();
    draft.questions[0]!.options.pop();
    expect(validateDraft(draft).map((error) => error.message)).toEqual([
      'Question 1 needs at least two options.',
    ]);
  });
});

describe('toNewPoll', () => {
  it('trims, and sends blank optional text as null', () => {
    expect(toNewPoll(filled())).toEqual({
      description: null,
      questions: [
        {
          content: 'Where should we eat?',
          options: [
            { label: 'Tacos', sublabel: null },
            { label: 'Ramen', sublabel: 'Downtown' },
          ],
          subheading: null,
        },
      ],
      title: 'Lunch',
    });
  });
});

describe('keys', () => {
  it('never reuses one', () => {
    const draft = filled();
    expect(nextKey(draft)).toBe(4);
    draft.questions.push(blankQuestion(nextKey(draft)));
    expect(nextKey(draft)).toBe(7);
  });
});

describe('parseDraft', () => {
  it('round-trips a draft', () => {
    expect(parseDraft(JSON.stringify(filled()))).toEqual(filled());
  });

  it('rejects anything that is not one', () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft('not json')).toBeNull();
    expect(parseDraft('{"title":"x"}')).toBeNull();
    expect(parseDraft('null')).toBeNull();
  });
});

describe('isBlank', () => {
  it('is true only for an untouched form', () => {
    expect(isBlank(emptyDraft())).toBe(true);
    expect(isBlank(filled())).toBe(false);
  });
});
