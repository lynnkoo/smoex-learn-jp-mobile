export const asyncMiddleware = ({ dispatch, getState }: any) => {
  return (next: any) => (action: any) => {
    const { target, type, success, meta, payload, failure } = action
    const { __values__ } = action
    console.log(action)
    if (target) {
      return async () => {
        const params = typeof meta === 'function' ? meta(getState()) : meta
        const base = { meta: params, __values__ }
        dispatch({ type, ...base })
        try {
          const response = await target(params, dispatch)
          const data = payload ? payload(response) : response
          if (success) {
            dispatch({ ...success(data), ...base })
          }
          return data
        } catch (e) {
          if (failure) {
            dispatch({ type: failure, error: e, ...base })
          }
          throw e
        }
      }
    }
    return next(action)
  }
}
