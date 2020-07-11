import { Question } from '~/polling/types/Question';

export interface Poll {
    pollId: number;
    title: string;
    description: string;
    link: string;
    questions: Question[];
}
