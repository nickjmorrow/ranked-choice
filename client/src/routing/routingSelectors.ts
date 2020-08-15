import { RootState } from '~/redux/RootState';
import { createMatchSelector } from 'connected-react-router';

const getParam = (route: string, id: string) => (state: RootState): string => {
    const matchSelector = createMatchSelector(route);
    const match = matchSelector(state) as any;
    if (match === null) {
        return '';
    }
    return match.params[id];
};

export const routingSelectors = { getParam };
