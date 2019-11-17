import { api } from '../utils'

type ISendCodeParams = {
  target: string
}

type IVerifyCodeParams = {
  code: number
  scene: 'login' | 'register'
}

export const securityAPI = {
  sendCode: (params: ISendCodeParams) => api.post('/security/sendcode', params),
  verifyCode: (params: IVerifyCodeParams) =>
    api.post('/security/verifycode', params),
}
