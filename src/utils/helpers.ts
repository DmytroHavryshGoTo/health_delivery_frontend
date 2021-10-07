import transformObjectKeys from 'transform-object-keys'
import axios, { AxiosInstance } from 'axios'

type jsonResp = {
  id: Number,
  type: String
  attributes: Object
}

export const toCamelCase = (obj: object): object => {
  return transformObjectKeys(obj, { deep: true })
}

export const toSnakeCase = (obj: object): object  => {
  return transformObjectKeys(obj, { snakeCase: true, deep: true })
}

export const extractAttrs = (data: Array<jsonResp>): Array<Object> => {
  return data.map(({ attributes }) => attributes)
}

export const Api = (): AxiosInstance => {
  const axiosInstance: AxiosInstance = axios.create({
		baseURL: `${process.env.VUE_APP_API_URL}`,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept-Language': localStorage.getItem('locale') || 'en'
		}
	})
  axiosInstance.interceptors.response.use(response => response, error => {
    if ([401, 403].includes(error.response.status) && window.location.pathname !== '/login') {
      console.log(error)
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  })

  return axiosInstance
}