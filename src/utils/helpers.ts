import transformObjectKeys from 'transform-object-keys'
import axios, { AxiosInstance } from 'axios'
import { SingleDeliveryJSONResponse, MultipleDeliveriesJSONResponse } from './types'

export const toCamelCase = (obj: object): object => {
  return transformObjectKeys(obj, { deep: true })
}

export const toSnakeCase = (obj: object): object  => {
  return transformObjectKeys(obj, { snakeCase: true, deep: true })
}

export const extractAttrs = (payload: MultipleDeliveriesJSONResponse): Array<Object> => {
  return payload.data.map(({ attributes }) => attributes)
}

export const extractSingleDeliveryAttrs = (payload: SingleDeliveryJSONResponse): Object => {
  return { ...payload.data.attributes, drugs: payload.included.map(({ attributes }) => attributes) }
}

export const extractMultipleDeliveriesAttrs = (payload: MultipleDeliveriesJSONResponse): Object => {
  let result = [...payload.data.map(({ attributes }) => attributes)]
  result = result.map(delivery => {
    delivery.drugs = []
    return delivery
  })

  payload.included.forEach(drug => {
    const idx = result.findIndex(({ id }) => id === drug.attributes.deliveryId)
    result[idx].drugs?.push(drug.attributes)
  })

  return result
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