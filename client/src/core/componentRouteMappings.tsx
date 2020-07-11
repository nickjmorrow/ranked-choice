import { Home } from '~/landing/Home';
import { SimulationPage } from '~/simulation/pages/SimulationPage';
import { CreatePollPage } from '~/poll-creation/pages/CreatePollPage';
import { PollVotingPage } from '~/poll-voting/PollVotingPage';

export const componentRouteMappings = [
    {
        component: Home,
        route: '/',
        label: 'Home',
        isVisible: false,
        exact: true,
    },
    {
        component: CreatePollPage,
        route: '/create-poll',
        label: 'Create Poll',
        isVisible: true,
        exact: true,
    },
    {
        component: SimulationPage,
        route: '/simulation',
        label: 'Simulation',
        isVisible: true,
        exact: true,
    },
    {
        component: PollVotingPage,
        route: '/voting/:link',
        label: 'Voting',
        isVisible: false,
        exact: false,
    },
];
