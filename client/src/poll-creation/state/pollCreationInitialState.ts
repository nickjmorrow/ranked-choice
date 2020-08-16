import { PollCreationState } from '~/poll-creation/types/PollCreationState';

export const pollCreationInitialState: PollCreationState = {
    title: 'Lynn County General Election',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    questions: [
        {
            questionId: 1,
            orderId: 1,
            content: 'Who should win the general election?',
            subheading: 'Select at most one.',
            isRequired: true,
            options: [
                { optionId: 1, label: 'Strawberry Woman', sublabel: 'Fruit Party' },
                { optionId: 2, label: 'Artichoke Man', sublabel: 'Vegetable Party' },
                { optionId: 3, label: 'Blueberry Guardian', sublabel: 'Small Party' },
            ],
        },
    ],
    currentInteractingQuestionId: null as null | number,
};
