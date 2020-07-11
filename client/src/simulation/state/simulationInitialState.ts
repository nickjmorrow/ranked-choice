import { SimulationState } from '~/simulation/types/SimulationState';

export const simulationInitialState: SimulationState = {
    pollResult: null,
    options: [
        {
            optionId: 1,
            label: 'Bloody Maroon',
            sublabel: null,
        },
        {
            optionId: 2,
            label: 'Cerulean Blue',
            sublabel: null,
        },
        {
            optionId: 3,
            label: 'Mysterious Purple',
            sublabel: null,
        },
    ],
    votes: [
        {
            voterId: 1,
            rankedOptions: [
                { optionId: 1, orderId: 3 },
                { optionId: 3, orderId: 2 },
                { optionId: 2, orderId: 1 },
            ],
        },
        {
            voterId: 2,
            rankedOptions: [
                { optionId: 1, orderId: 1 },
                { optionId: 3, orderId: 2 },
                { optionId: 2, orderId: 3 },
            ],
        },
        {
            voterId: 3,
            rankedOptions: [
                { optionId: 1, orderId: 2 },
                { optionId: 3, orderId: 1 },
                { optionId: 2, orderId: 3 },
            ],
        },
        {
            voterId: 4,
            rankedOptions: [
                { optionId: 1, orderId: 2 },
                { optionId: 3, orderId: 3 },
                { optionId: 2, orderId: 1 },
            ],
        },
        {
            voterId: 5,
            rankedOptions: [
                { optionId: 1, orderId: 1 },
                { optionId: 3, orderId: 2 },
            ],
        },
        {
            voterId: 6,
            rankedOptions: [
                { optionId: 1, orderId: 1 },
                { optionId: 3, orderId: 2 },
            ],
        },
        {
            voterId: 7,
            rankedOptions: [{ optionId: 1, orderId: 1 }],
        },
        {
            voterId: 8,
            rankedOptions: [{ optionId: 3, orderId: 1 }],
        },
        {
            voterId: 9,
            rankedOptions: [
                { optionId: 3, orderId: 1 },
                { optionId: 2, orderId: 2 },
            ],
        },
    ],
};
