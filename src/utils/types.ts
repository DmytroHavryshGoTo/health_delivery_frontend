type BasicResponceObject = {
  attributes: Object;
};

export type MultipleBasicResponceObjects = {
  data: Array<BasicResponceObject>;
};

export type Delivery = {
  attributes: {
    createdAt: String;
    status: "preparing_to_deliver" | "delivering" | "delivered";
    estimatedDeliveryDate: String;
    id: Number;
    route: Array<{ name: String }>;
    ttn: String;
    userId: Number;
    lat: Number;
    lon: Number;
    drugs?: any;
    adId?: Number;
  };
  id: Number;
  type: "delivery";
};

export type Drug = {
  attributes: {
    id: Number;
    deliveryId: Number;
    maxHumidity: Number;
    maxTemperature: Number;
    minHumidity: Number;
    minTemperature: Number;
    name: String;
    quantity: Number;
    status:
      | "good"
      | "exceeded_min_temperature"
      | "exceeded_min_humidity"
      | "exceeded_max_temperature"
      | "exceeded_max_humidity";
  };
  id: Number;
  type: "drug";
};

export type Ad = {
  attributes: {
    id: Number;
    createdAt: String;
    status: "waiting" | "completed" | "in_progress";
    name: String;
    address: String;
    description: String;
    completed: Boolean;
  };
  relationships: {
    user: {
      data: {
        id: Number;
        type: "user";
      };
    };
    delivery: {
      data?: {
        id: Number;
        type: "delivery";
      };
    };
  };
  id: Number;
  type: "ad";
};

export type User = {
  attributes: {
    id: Number;
    firstName: String;
    lastName: String;
    email: String;
    phoneNumber: String;
    admin: Boolean;
    needHelp: Boolean;
  };
  id: Number;
  type: "user";
};

export type SingleItemJSONResponse<T, O> = {
  data: T;
  included: Array<O>;
};

export type MultipleItemsJSONResponse<T, O> = {
  data: Array<T>;
  included: Array<O>;
};
