import AxiosClient from 'axios'
import * as qs from 'qs'

export class ApiError {
  public code: number
  public message: string
  public info: any

  constructor(code: number, message: string, info?: any) {
    this.code = code
    this.message = message
    this.info = info
  }
}

export const api = AxiosClient.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'https://api.smoex.com',
  timeout: 100000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: (params: any) => {
    if (params instanceof FormData) {
      return params
    }
    return qs.stringify(params)
  },
  transformResponse: (body) => {
    if (body.code === 0) {
      return body.data
    } else {
      // return data
      throw new ApiError(-1, body.data.message, body.data)
    }
  },
})

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

export const withFormData = (params: any) => {
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  return formData
}

// export const api = {
//   get: axios.get,
//   post: axios.post,
//   postWithFormData: () => axios.post()
// }
