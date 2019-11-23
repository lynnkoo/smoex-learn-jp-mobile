import * as React from 'react'
import * as Redux from 'react-redux'
import { createSelector } from 'reselect'

export function useScopedAction(name: string, action: any, deps: any[] = []) {
  const dispatch = Redux.useDispatch()
  const [loading, setLoading] = React.useState(false)
  const actionCreator = useAsyncCallback(async (...opts: any[]) => {
    const values = name ? { __values__: { scope: name } } : {}
    const promise = dispatch({ ...action(...opts), ...values })
    if (promise instanceof Function) {
      setLoading(true)
      try {
        await promise()
      } finally {
        setLoading(false)
      }
    }
  }, deps)
  return [actionCreator, loading]
}

// export function useGlobalAction(action: any, deps: any[] = []) {
//   const actions = useScopedAction('', action, deps)
//   return actions
// }

function createSelectorMemo(selector: any) {
  return () =>
    createSelector(
      selector,
      (state: any) => state,
    )
}

export function useScopedSelector(name: string, selector: any) {
  const memoSelector = React.useMemo(createSelectorMemo(selector), [])
  return Redux.useSelector((state: any) => {
    if (!name) {
      return memoSelector(state)
    }
    const scoped = state[name]
    if (scoped) {
      return memoSelector(scoped)
    }
  })
}

// export function useGlobalSelector(selector: any) {
//   return useScopedSelector('', selector)
// }

export function useAsyncCallback(callback: any, deps: any = []) {
  return React.useMemo(() => {
    return callback
  }, deps)
}

export function useActionCallback(callback: any, deps: any = []) {
  const [error, setError] = React.useState(null)
  const promise = React.useMemo(() => {
    return async () => {
      setError(null)
      try {
        await callback()
      } catch (e) {
        setError(e)
      }
    }
  }, deps)
  return [promise, error]
}
