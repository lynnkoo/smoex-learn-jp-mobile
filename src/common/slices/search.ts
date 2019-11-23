import { accountReducer } from '../../shared/smoex-frontend-basic/logics'
import { Loading } from 'shared/smoex-moblie-basic/components/Loading'
import {
  useScopedSelector,
  useScopedAction,
  injectReducers,
} from 'shared/redux-async-kit'

const SLICE_NAME = 'search'

// export homeSlice = createSlice(SLICE_NAME, )

const reducers = {
  account: accountReducer,
  account2: accountReducer,
}

export function injectHomeReducers() {
  injectReducers(SLICE_NAME, reducers)
}

export function useHomeAction(action: any, deps?: any) {
  return useScopedAction(SLICE_NAME, action, deps)
}

export function useHomeSelector(selector: any) {
  return useScopedSelector(SLICE_NAME, selector)
}

export const selectHomeState = (state: any) => state.home

export const HomeSlice = {
  injectReducers: injectHomeReducers,
  useAction: useHomeAction,
  useSelector: useHomeSelector,
  selectState: selectHomeState,
}
