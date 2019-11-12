
import { accountReducer } from '../../platform/common/logics';
import { Loading } from 'platform/components/Loading';
import { createSlice, useScopedSelector, useScopedAction } from 'redux-async-kit'

const SLICE_NAME = 'home'

export function createHomeSlice(opts: any) {
  const { loader, loading } = opts
  return createSlice({
    loader,
    loading,
    name: SLICE_NAME,
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
