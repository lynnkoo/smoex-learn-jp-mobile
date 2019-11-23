import * as loadable2 from 'react-loadable'
import { injectReducers } from './injector'
import produce from 'immer'
import { cloneDeep } from 'lodash'
import { useScopedAction, useScopedSelector } from './hooks'

const loadable: any = loadable2

const NoLoading: React.FC = () => {
  return null
}

export function createLazyComponent(opts: any) {
  const { loader, loading, injector } = opts
  return loadable({
    loader: () => {
      if (injector) {
        injector()
      }
      return loader()
    },
    loading: loading || NoLoading,
  })
}

export function createSlice(name: string, reducers: any) {
  return {
    selector: (state: any) => state[name],
    injector: () => {
      injectReducers(name, reducers)
    },
    useAction: (action: any, deps?: any) => {
      return useScopedAction(name, action, deps)
    },
    useSelector: (selector: any) => {
      return useScopedSelector(name, selector)
    },
  }
}

export function createReducer(initialState: any, reducerMap: any) {
  return (injectState: any = initialState) => {
    const injectedState = cloneDeep(Object.assign(initialState, injectState))
    return produce((state: any = injectedState, action: any) => {
      const { __values__: { scope } = {} as any } = state
      const { __values__: { scope: actionScope } = {} as any } = action
      if (scope && scope !== actionScope) {
        return state
      }
      const reducer = reducerMap(state)[action.type]
      if (reducer) {
        return reducer(action)
      }
      return state
    })
  }
}
