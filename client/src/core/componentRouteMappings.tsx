import { Home } from '~/landing/Home';
import { SimulationPage } from '~/simulation/pages/SimulationPage';
import { CreatePollPage } from '~/poll-creation/pages/CreatePollPage';
import { PollVotingPage } from '~/poll-voting/PollVotingPage';
import { PollResultPage } from '~/poll-results/pages/PollResultPage';
import { VoteSuccessPage } from '~/poll-voting/pages/VoteSuccessPage';
import { CreatePollSuccessPage } from '~/poll-creation/pages/CreatePollSuccessPage';

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
    {
        component: VoteSuccessPage,
        route: '/voting-success',
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
        isVisible: false,
        exact: false,
    },
];
