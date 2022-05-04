import transformObjectKeys from 'transform-object-keys'
import axios, { AxiosInstance } from 'axios'
import {
  SingleItemJSONResponse,
  MultipleBasicResponceObjects,
  MultipleItemsJSONResponse,
  Delivery,
  Drug,
  Ad,
  User,
} from "./types";

export const toCamelCase = (obj: object): object => {
  return transformObjectKeys(obj, { deep: true });
};

export const toSnakeCase = (obj: object): object => {
  return transformObjectKeys(obj, { snakeCase: true, deep: true });
};

export const extractAttrs = (
  payload: MultipleBasicResponceObjects
): Array<Object> => {
  return payload.data.map(({ attributes }) => attributes);
};

export const extractSingleDeliveryAttrs = (
  payload: SingleItemJSONResponse<Delivery, Ad | Drug>
): Object => {
  return {
    ...payload.data.attributes,
    drugs: payload.included
      .filter(({ type }) => type === "drug")
      .map(({ attributes }) => attributes),
    ad: payload.included.find(({ type }) => type === "ad"),
  };
};

export const extractMultipleDeliveriesAttrs = (
  payload: MultipleItemsJSONResponse<Delivery, Ad | Drug>
): Object => {
  let result = [...payload.data.map(({ attributes }) => attributes)];
  result = result.map((delivery) => {
    delivery.drugs = [];
    return delivery;
  });

  payload.included.forEach((drug) => {
    if (drug.type === "drug") {
      const idx = result.findIndex(
        ({ id }) => id == drug.attributes.deliveryId
      );
      result[idx].drugs?.push(drug.attributes);
    }
  });
  return result;
};

export const extractAdInformation = ({
  data: { attributes, relationships },
  included,
}: SingleItemJSONResponse<Ad, User>): Object => {
  const userId = relationships.user.data.id;
  const user = included.find(({ id }) => id === userId)!.attributes;
  return {
    ...attributes,
    deliveryId: relationships.delivery.data?.id,
    user,
  };
};

export const extractAdsInformation = (
  payload: MultipleItemsJSONResponse<Ad, User>
): Array<Object> => {
  return payload.data.map(({ attributes, relationships }) => {
    const userId = relationships.user.data.id;
    const user = payload.included.find(({ id }) => id === userId)!.attributes;
    return {
      ...attributes,
      deliveryId: relationships.delivery.data?.id,
      user,
    };
  });
};

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