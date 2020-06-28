export const pollCreationInitialState = {
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
                { optionId: 1, label: 'Prince Passionfruit' },
                { optionId: 2, label: 'Sarah Strawberry' },
                { optionId: 3, label: 'Benny Blueberry' },
            ],
        },
    ],
};
