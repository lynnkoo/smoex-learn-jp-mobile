import { ACCOUNT_ASYNC_ACTION, ACCOUNT_ACTION } from './enums'
import { createReducer } from 'redux-async-kit'

const initialState = {
  name: '123',
}

const reducerMap = (state: any) => ({
  [ACCOUNT_ASYNC_ACTION.GET_INFO]: () => {
    state.loading = true
  },
  [ACCOUNT_ACTION.SET_INFO]: ({ payload }: any) => {
    state.loading = false
    state.group = payload.group
    state.name = payload.name
    state.payload = payload
  },
  [ACCOUNT_ACTION.SET_ERROR]: () => {
    state.loading = false
    state.name = 'error'
  },
})

export const accountReducer = createReducer(initialState, reducerMap)
