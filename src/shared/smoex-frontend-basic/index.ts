import { createSlice } from 'shared/redux-async-kit'
import { accountReducer } from './logics'

export const commonSlice = createSlice('common', {
  account: accountReducer,
})
