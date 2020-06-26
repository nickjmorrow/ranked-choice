import { Home } from '~/landing/Home';
import { SimulationPage } from '~/simulation/pages/SimulationPage';

export const componentRouteMappings = [
    {
        component: Home,
        route: '/',
        label: 'Home',
        isVisible: true,
    },
    {
        component: SimulationPage,
        route: '/simulation',
        label: 'Simulation',
        isVisible: true,
    },
];
