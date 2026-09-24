import type { NewPoll } from 'src/api/types';

/**
 * The create-poll form's state, and the checks it runs before sending — the
 * same rules the API enforces, so a mistake is explained next to the field
 * rather than after a round trip.
 *
 * Every question and option carries a `key` of its own: React needs a stable
 * one, and focus management needs to find "the option just added".
 */

export interface DraftOption {
  key: number;
  label: string;
  sublabel: string;
}

export interface DraftQuestion {
  key: number;
  content: string;
  subheading: string;
  options: DraftOption[];
}

export interface PollDraft {
  title: string;
  description: string;
  questions: DraftQuestion[];
}

export interface DraftError {
  /** The id of the input at fault, so the error summary can link to it. */
  fieldId: string;
  message: string;
}

export const MAX_QUESTIONS = 20;
export const MAX_OPTIONS = 20;
export const TEXT_LIMIT = 255;
export const DESCRIPTION_LIMIT = 2000;

export const TITLE_ID = 'poll-title';
export const questionFieldId = (question: number) => `question-${String(question)}-content`;
export const addOptionButtonId = (question: number) => `question-${String(question)}-add-option`;
export const ADD_QUESTION_ID = 'add-question';
export const optionFieldId = (question: number, option: number) =>
  `question-${String(question)}-option-${String(option)}-label`;

/** The largest key anywhere in the draft, plus one. */
export function nextKey(draft: PollDraft): number {
  let max = 0;
  for (const question of draft.questions) {
    max = Math.max(max, question.key);
    for (const option of question.options) max = Math.max(max, option.key);
  }
  return max + 1;
}

export function blankQuestion(firstKey: number): DraftQuestion {
  return {
    content: '',
    key: firstKey,
    options: [
      { key: firstKey + 1, label: '', sublabel: '' },
      { key: firstKey + 2, label: '', sublabel: '' },
    ],
    subheading: '',
  };
}

export function emptyDraft(): PollDraft {
  return { description: '', questions: [blankQuestion(1)], title: '' };
}

/** Every problem with the draft, in the order the fields appear. Empty means sendable. */
export function validateDraft(draft: PollDraft): DraftError[] {
  const errors: DraftError[] =
    draft.title.trim() === '' ? [{ fieldId: TITLE_ID, message: 'Give the poll a title.' }] : [];

  for (const [questionIndex, question] of draft.questions.entries()) {
    const name = `Question ${String(questionIndex + 1)}`;
    if (question.content.trim() === '') {
      errors.push({ fieldId: questionFieldId(question.key), message: `${name} needs a prompt.` });
    }

    const seen = new Set<string>();
    for (const [optionIndex, option] of question.options.entries()) {
      const label = option.label.trim().toLowerCase();
      const fieldId = optionFieldId(question.key, option.key);
      if (label === '') {
        errors.push({
          fieldId,
          message: `${name}, option ${String(optionIndex + 1)} needs a label, or remove it.`,
        });
      } else if (seen.has(label)) {
        errors.push({ fieldId, message: `${name} lists “${option.label.trim()}” twice.` });
      }
      seen.add(label);
    }

    if (question.options.length < 2) {
      errors.push({
        fieldId: questionFieldId(question.key),
        message: `${name} needs at least two options.`,
      });
    }
  }

  return errors;
}

/** The draft as the API wants it: trimmed, with blank optional text as null. */
export function toNewPoll(draft: PollDraft): NewPoll {
  return {
    description: optional(draft.description),
    questions: draft.questions.map((question) => ({
      content: question.content.trim(),
      options: question.options.map((option) => ({
        label: option.label.trim(),
        sublabel: optional(option.sublabel),
      })),
      subheading: optional(question.subheading),
    })),
    title: draft.title.trim(),
  };
}

function optional(text: string): null | string {
  return text.trim() === '' ? null : text.trim();
}

/**
 * A draft read back from storage, or null if it is not one. Storage is
 * written by this app, but by an older build of it as often as not.
 */
export function parseDraft(json: string | null): null | PollDraft {
  if (json === null) return null;
  try {
    const value = JSON.parse(json) as Partial<PollDraft> | null;
    if (
      typeof value?.title !== 'string' ||
      typeof value.description !== 'string' ||
      !Array.isArray(value.questions) ||
      value.questions.length === 0
    ) {
      return null;
    }
    return value as PollDraft;
  } catch {
    return null;
  }
}

/** Whether the draft has anything in it worth keeping. */
export function isBlank(draft: PollDraft): boolean {
  return (
    draft.title.trim() === '' &&
    draft.description.trim() === '' &&
    draft.questions.every(
      (question) =>
        question.content.trim() === '' &&
        question.subheading.trim() === '' &&
        question.options.every(
          (option) => option.label.trim() === '' && option.sublabel.trim() === '',
        ),
    )
  );
}
