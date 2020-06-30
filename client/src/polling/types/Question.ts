import { Option } from '~/polling/types/Option';

export interface Question {
    questionId: number;
    orderId: number;
    content: string;
    subheading: string;
    isRequired: boolean;
    options: Option[];
}
