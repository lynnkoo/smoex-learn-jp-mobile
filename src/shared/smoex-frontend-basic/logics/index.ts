import { combineReducers } from 'redux'
import { accountReducer } from './account/reducers'

export const commonReducer = combineReducers({
  account: accountReducer(),
})
export { accountReducer }
