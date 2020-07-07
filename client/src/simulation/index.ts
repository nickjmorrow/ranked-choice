import { simulationReducer } from '~/simulation/state/simulationReducer';
import { simulationSagas } from '~/simulation/simulationSagas';

export const simulationApi = {
    reducer: simulationReducer,
    sagas: simulationSagas,
};
