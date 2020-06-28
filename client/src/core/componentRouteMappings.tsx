import { Home } from '~/landing/Home';
import { SimulationPage } from '~/simulation/pages/SimulationPage';
import { CreatePollPage } from '~/poll-creation/pages/CreatePollPage';

export const componentRouteMappings = [
    {
        component: Home,
        route: '/',
        label: 'Home',
        isVisible: false,
    },
    {
        component: CreatePollPage,
        route: '/create-poll',
        label: 'Create Poll',
        isVisible: true,
    },
    {
        component: SimulationPage,
        route: '/simulation',
        label: 'Simulation',
        isVisible: true,
    },
];
