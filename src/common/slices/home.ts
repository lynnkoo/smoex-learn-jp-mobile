import { accountReducer } from '../../shared/smoex-frontend-basic/logics'
import { Loading } from 'shared/smoex-moblie-basic/components/Loading'
import {
  useScopedSelector,
  useScopedAction,
  injectReducers,
  createSlice,
} from 'shared/redux-async-kit'

const SLICE_NAME = 'home'

const reducers = {
  account: accountReducer,
  account2: accountReducer,
}

export const homeSlice = createSlice(SLICE_NAME, reducers)

// export function injectHomeReducers() {
//   injectReducers(SLICE_NAME, reducers)
// }

// export function useHomeAction(action: any, deps?: any) {
//   return useScopedAction(SLICE_NAME, action, deps)
// }

// export function useHomeSelector(selector: any) {
//   return useScopedSelector(SLICE_NAME, selector)
// }

// export const selectHomeAccount = (state: any) => state.home.account
