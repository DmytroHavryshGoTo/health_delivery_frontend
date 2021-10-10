type Delivery = {
  attributes: {
    createdAt: String,
    status: 'preparing_to_deliver' | 'delivering' | 'delivered',
    estimatedDeliveryDate: String,
    id: Number,
    route: Array<{name: String}>,
    ttn: String,
    userId: Number,
    lat: Number,
    lon: Number,
    drugs?: any
  },
  id: Number,
  type: 'delivery'
}

type Drug = {
  attributes: {
    id: Number,
    deliveryId: Number,
    maxHumidity: Number,
    maxTemperature: Number,
    minHumidity: Number,
    minTemperature: Number,
    name: String,
    status: 'good' | 'exceeded_min_temperature' | 'exceeded_min_humidity' | 'exceeded_max_temperature'| 'exceeded_max_humidity'
  },
  id: Number,
  type: 'drug'
}

export type SingleDeliveryJSONResponse = {
  data: {
    attributes: Delivery
  },
  included: Array<Drug>
}

export type MultipleDeliveriesJSONResponse = {
  data: Array<Delivery>,
  included: Array<Drug>
}