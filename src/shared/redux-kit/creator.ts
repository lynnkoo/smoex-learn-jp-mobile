import loadableTemp from 'react-loadable'
import { combineReducers } from 'redux'
import { injectReducers } from './store'
import produce from 'immer'
import { mapValues, cloneDeep } from 'lodash'

const loadable: any = loadableTemp
const NoLoading: React.FC = () => {
  return null
}

export function createSlice(opts: any) {
  const { reducers = {}, loader, name, loading} = opts
  const route = loadable({
    loader: () => {
      if (reducers) {
        injectReducers(reducers, name)
      }
      return loader()
    },
    loading: loading || NoLoading
  })
  return route
}

export function createReducer(initialState: any, reducerMap: any) {
  return (injectState: any = initialState) => {
    const injectedState = cloneDeep(Object.assign(initialState, injectState))
    return produce((state: any = injectedState, action: any) => {
      const { __values__: { scope } = {} as any } = state
      const { __values__: { scope: actionScope } = {} as any} = action
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
