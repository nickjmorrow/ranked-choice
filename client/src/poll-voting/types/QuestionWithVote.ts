import { Question } from '~/polling/types/Question';
import { Option } from '~/polling/types/Option';

export interface QuestionWithVote extends Question {
    options: OrderedOption[];
}

export interface OrderedOption extends Option {
    orderId: number | null;
}

export interface FilledOrderedOption extends OrderedOption {
    orderId: number;
}
