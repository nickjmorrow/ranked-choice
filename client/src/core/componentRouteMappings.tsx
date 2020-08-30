import { SimulationPage } from '~/simulation/pages/SimulationPage';
import { CreatePollPage } from '~/poll-creation/pages/CreatePollPage';
import { PollVotingPage } from '~/poll-voting/PollVotingPage';
import { PollResultPage } from '~/poll-results/pages/PollResultPage';
import { VoteSuccessPage } from '~/poll-voting/pages/VoteSuccessPage';
import { CreatePollSuccessPage } from '~/poll-creation/pages/CreatePollSuccessPage';

export const componentRouteMappings: {
    component: React.ReactNode;
    route: string;
    label: string;
    link?: string;
    description?: string;
    exampleLink?: string;
    isVisible: boolean;
    exact: boolean;
}[] = [
    {
        component: CreatePollPage,
        route: '/create-poll',
        label: 'Create Poll',
        description: 'Create a poll.',
        isVisible: true,
        exact: true,
    },
    {
        component: SimulationPage,
        route: '/simulation/*',
        link: '/simulation/create',
        description: 'Simulate creating, voting, and viewing poll results.',
        label: 'Simulation',
        isVisible: true,
        exact: false,
    },
    {
        component: PollVotingPage,
        route: '/voting/:link',
        label: 'Voting',
        description: 'Vote on a poll.',
        exampleLink: '/voting/example',
        isVisible: false,
        exact: false,
    },
    {
        component: VoteSuccessPage,
        route: '/voting-success/:link',
        label: 'Voting Success',
        isVisible: false,
        exact: false,
    },
    {
        component: CreatePollSuccessPage,
        route: '/creation-success/:link',
        label: 'Creation Success',
        isVisible: false,
        exact: false,
    },
    {
        component: PollResultPage,
        route: '/results/:link',
        label: 'Results',
        description: 'View the results of a poll.',
        exampleLink: '/results/example',
        isVisible: false,
        exact: false,
    },
];
