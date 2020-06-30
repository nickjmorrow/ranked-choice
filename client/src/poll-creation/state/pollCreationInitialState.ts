import { PollCreationState } from '~/poll-creation/types/PollCreationState';

export const pollCreationInitialState: PollCreationState = {
    title: '',
    description: '',
    questions: [
        {
            questionId: 1,
            orderId: 1,
            content: 'U.S. House of Representatives for District 1',
            subheading: 'Rank all available options.',
            isRequired: true,
            options: [
                { optionId: 1, label: 'Prince Passionfruit', sublabel: 'Sweet Fruit Party' },
                { optionId: 2, label: 'Sarah Strawberry', sublabel: 'Classic Fruit Party' },
                { optionId: 3, label: 'Benny Blueberry', sublabel: 'Small Fruit Party' },
            ],
        },
    ],
    currentInteractingQuestionId: null as null | number,
};
