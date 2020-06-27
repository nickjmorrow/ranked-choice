import { SimulationState } from '~/simulation/types/SimulationState';

export const simulationInitialState: SimulationState = {
    options: [
        {
            optionId: 1,
            label: 'Bloody Maroon',
        },
        {
            optionId: 2,
            label: 'Cerulean Blue',
        },
        {
            optionId: 3,
            label: 'Mysterious Purple',
        },
    ],
    votes: [
        {
            voterId: 1,
            choices: [
                { optionId: 1, orderId: 1 },
                { optionId: 2, orderId: 2 },
            ],
        },
        {
            voterId: 2,
            choices: [
                { optionId: 1, orderId: 1 },
                { optionId: 3, orderId: 2 },
            ],
        },
        {
            voterId: 3,
            choices: [{ optionId: 1, orderId: 1 }],
        },
        {
            voterId: 4,
            choices: [{ optionId: 1, orderId: 1 }],
        },
        {
            voterId: 5,
            choices: [{ optionId: 2, orderId: 1 }],
        },
        {
            voterId: 6,
            choices: [{ optionId: 2, orderId: 1 }],
        },
        {
            voterId: 7,
            choices: [{ optionId: 2, orderId: 1 }],
        },
        {
            voterId: 8,
            choices: [
                { optionId: 3, orderId: 1 },
                { optionId: 2, orderId: 1 },
            ],
        },
        {
            voterId: 9,
            choices: [
                { optionId: 3, orderId: 1 },
                { optionId: 2, orderId: 1 },
            ],
        },
    ],
};
