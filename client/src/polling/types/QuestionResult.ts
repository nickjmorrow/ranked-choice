import { Round } from '~/polling/types/Round';
import { Option } from '~/polling/types/Option';
import { Question } from '~/polling/types/Question';

export interface QuestionResult {
    rounds: Round[];
    question: Question;
    options: Option[];
}
