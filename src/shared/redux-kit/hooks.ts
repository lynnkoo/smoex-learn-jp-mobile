import * as React from 'react'
import * as Redux from "react-redux";
import { createSelector } from 'reselect';

export function useAction(action: any, deps: any[] = []) {
  const dispatch = Redux.useDispatch()
  return React.useCallback((opts = {}) => {
    dispatch(action(opts))
  }, deps)
}

export function useScopedAction(name: string, action: any, deps: any[] = []) {
  const dispatch = Redux.useDispatch()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const actionCreator = useAsyncCallback(async (...opts: any[]) => {
    const values = name ? {  __values__: { scope: name} } : {}
    const promise = dispatch({ ...action(...opts), ...values })
    if (promise instanceof Function) {
      setLoading(true)
      setError(null)
      try {
        await promise()
      } catch (e) {
        setError(e)
        throw e
      } finally {
        setLoading(false)
      }
    }
  }, deps)
  return [actionCreator, loading, error]
}

export function useGlobalAction(action: any, deps: any[] = []) {
  const actions = useScopedAction('', action, deps)
  return actions
}

function createSelectorMemo(selector: any) {
  return () => createSelector(selector, (state: any) => state)
}

export function useScopedSelector(name: string, selector: any) {
  const memoSelector = React.useMemo(createSelectorMemo(selector) , [])
  return Redux.useSelector((state: any) => {
    if (!name) {
      return memoSelector(state)
    }
    const scoped = state[name]
    if (scoped) {
      return memoSelector(scoped)
    }
  });
}

export function useGlobalSelector(selector: any) {
  return useScopedSelector('', selector);
}
export function useAsyncCallback(callback: any, deps: any = []) {
  return React.useMemo(() => {
    return callback }, deps)
}

export function useActionCallback(callback: any, deps: any = []) {
  return React.useMemo(() => {
    return async () => {
      try {
        await callback()
      } catch (e) {
        //
      }
    }
  }, deps)
}
