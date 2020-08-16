// external
import React from 'react';
import { QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { QuestionListContainer } from '~/polling/components/QuestionListContainer';
import { Question } from '~/poll-voting/components/Question';

export const QuestionList: React.FC<{ questions: QuestionWithVote[] }> = ({ questions }) => {
    return (
        <QuestionListContainer>
            {questions.map(q => (
                <Question question={q} key={q.questionId} />
            ))}
        </QuestionListContainer>
    );
};
