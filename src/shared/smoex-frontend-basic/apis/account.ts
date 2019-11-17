import { api } from '../utils'

type IAccountLoginParams = {
  account: string
  password: string
}

export const accountAPI = {
  getInfo: () => api.get('/account/info'),
  logout: () => api.post('/account/logout'),
  login: (params: IAccountLoginParams) => api.post('/account/login', params),
  register: (params: any) => api.post('/account/register', params),
}
