import { ACCOUNT_ACTION, ACCOUNT_ASYNC_ACTION } from './enums'
import { accountAPI } from '../../apis/account'
import { asAccountParams } from './convertors'
import { accountApi } from '../../apis'

export const accountAction = {
  setInfo: (data: any) => ({
    type: ACCOUNT_ACTION.SET_INFO,
    payload: data,
  }),
}

export const accountAsyncAction = {
  getInfo: () => ({
    type: ACCOUNT_ASYNC_ACTION.GET_INFO,
    target: accountAPI.getInfo,
    failure: ACCOUNT_ACTION.SET_ERROR,
    success: accountAction.setInfo,
  }),
  login: (account: string, password: string) => ({
    type: ACCOUNT_ASYNC_ACTION.LOGIN,
    meta: { account, password },
    target: accountAPI.login,
  }),
}
