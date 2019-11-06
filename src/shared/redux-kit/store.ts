
import produce from 'immer'
import { createStructuredSelector } from 'reselect';
import { createEpicMiddleware, combineEpics, Epic, ofType } from 'redux-observable';
import { bindActionCreators, Dispatch, compose, applyMiddleware, createStore, combineReducers, Store } from "redux";
import { asyncMiddleware } from './async';
import { mapValues, cloneDeep } from 'lodash'
// export const DEFAULT_REDUCER_SCOPE = 'global'

let storeInstance: Store | undefined
let asyncReducers: any

export function configureStore(configure: any = {}, initialState = {}) {
  const { epics, middlewares = [], reducers = {} } = configure
  // configure middlewares
  const defaultMiddlewares: any[] = [
    asyncMiddleware,
  ]
  asyncReducers = injectReducerState(reducers)
  console.log(asyncReducers)
  const runEpics = epics && epics.length > 0
  const epicMiddleware = createEpicMiddleware()
  if (runEpics) {
    defaultMiddlewares.push(epicMiddleware)
  }

  const combinedMiddlewares = [
    ...defaultMiddlewares,
    ...middlewares,
  ]
  // compose enhancers
  const enhancer = compose(applyMiddleware(...combinedMiddlewares))

  const combinedReducers = combineReducers({ ...asyncReducers })
  // create store
  const store = createStore(combinedReducers, initialState, enhancer)
  if (runEpics) {
      epicMiddleware.run(epics)
  }
  storeInstance = store;
  // TODO: export store
  (window as any).store = store
  return store
}

const initialValues = {
  // scope: DEFAULT_REDUCER_SCOPE,
}

export function injectReducerState(reducers: any, values: any = {}) {
  const mergedValues = { ...initialValues, ...values }
  return mapValues(reducers, reducer => {
    if (Object.keys(mergedValues).length === 0) {
      return reducer()
    }
    return reducer({ __values__: mergedValues})
  })
}

export function injectReducers(reducers: any, name?: string) {
  if (name) {
    if (asyncReducers[name]) {
      console.warn('exist reducer name')
      return
    }
    if (!storeInstance) {
      return
    }
    const injectedReducers  = injectReducerState(reducers, { scope: name })
    asyncReducers[name] = combineReducers(injectedReducers)
    const combinedReducers = combineReducers({ ...asyncReducers })
    storeInstance.replaceReducer(combinedReducers)
  }
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
