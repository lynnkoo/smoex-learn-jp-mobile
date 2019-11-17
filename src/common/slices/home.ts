import { accountReducer } from '../../shared/smoex-frontend-basic/logics'
import { Loading } from 'shared/smoex-moblie-basic/components/Loading'
import {
  createSlice,
  useScopedSelector,
  useScopedAction,
} from 'redux-async-kit'

const SLICE_NAME = 'home'

export function createHomeSlice(opts: any) {
  const { loader, loading } = opts
  return createSlice(SLICE_NAME, {
    loader,
    loading,
    reducers: {
      account: accountReducer,
      account2: accountReducer,
    },
  })
}

export function useHomeAction(action: any, deps?: any) {
  return useScopedAction(SLICE_NAME, action, deps)
}

export function useHomeSelector(selector: any) {
  return useScopedSelector(SLICE_NAME, selector)
}

export const selectHomeAccount = (state: any) => state.home.account
