
import * as React from 'react'
import { createContainer } from '../../shared/redux-kit/dynamic';
import { accountReducer } from '../../platform/common/logics';
import { useScopedSelector, useScopedAction } from 'shared/redux-kit';
import { Loading } from 'platform/components/Loading';

const SLICE_NAME = 'home'

export function createHomeSlice(opts: any) {
  const { loader, loading } = opts
  return createContainer({
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
