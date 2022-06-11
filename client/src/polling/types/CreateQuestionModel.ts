import { Question } from '~/polling/types/Question';

export type CreateQuestionModel = Omit<Question, 'questionId'>;
