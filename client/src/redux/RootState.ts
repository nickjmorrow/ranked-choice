import { createRootReducer } from '~/redux/createRootReducer';
import { StateType } from 'typesafe-actions';

export {};
// export type RootState = ReturnType<typeof createRootReducer>;
export type RootState = StateType<ReturnType<typeof createRootReducer>>;
