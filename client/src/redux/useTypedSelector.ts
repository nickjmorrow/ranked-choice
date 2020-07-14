// reducer.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '~/redux/RootState';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
