import Vue from 'vue'
import Vuex from 'vuex'
import {
  extractAdInformation,
  extractAdsInformation,
  toSnakeCase,
} from "@/utils/helpers";
import {
  Api,
  extractAttrs,
  extractSingleDeliveryAttrs,
  extractMultipleDeliveriesAttrs,
} from "@/utils/helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    users: [],
    deliveries: [],
    googleMapDeliveries: [],
    delivery: {
      route: [],
      drugs: [],
    },
    dbDumps: [],
    storeLocale: "",
    ads: [],
    ad: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUsers(state, payload) {
      state.users = payload;
    },
    setDeliveries(state, payload) {
      state.deliveries = payload;
    },
    setGoogleMapDeliveries(state, payload) {
      state.googleMapDeliveries = payload;
    },
    setDelivery(state, payload) {
      state.delivery = payload;
    },
    setDbDumps(state, payload) {
      state.dbDumps = payload;
    },
    setStoreLocale(state, payload) {
      state.storeLocale = payload;
    },
    setAds(state, payload) {
      state.ads = payload;
    },
    setAd(state, payload) {
      state.ad = payload;
    },
    completeAd(state, adId) {
      const idx = state.ads.findIndex(({ id }) => id === adId);
      Vue.set(state.ads[idx], "status", "completed");
    },
  },
  actions: {
    async loginUserAction(_, form: object): Promise<object> {
      try {
        const { data } = await Api().post("/sign_in", toSnakeCase(form));
        localStorage.setItem("token", data.meta.token);
        return Promise.resolve(data);
      } catch (e) {
        console.log(e.response);
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async signUpUserAction(_, form: object): Promise<object> {
      try {
        const { data } = await Api().post("/users", toSnakeCase(form));
        return Promise.resolve(data);
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadUserProfileAction({ commit }) {
      try {
        const { data } = await Api().get("/users/me");
        commit("setUser", data.data.attributes);
        return Promise.resolve(data);
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadUsersAction({ commit }) {
      try {
        const { data } = await Api().get("/users");
        commit("setUsers", extractAttrs(data));
        return Promise.resolve(data);
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async updateUserAction(_, form) {
      try {
        const { data } = await Api().put(
          `/users/${form.user.id}`,
          toSnakeCase(form)
        );
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async createDeliveryAction(_, form) {
      try {
        await Api().post("/deliveries", toSnakeCase(form));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadDeliveriesAction({ commit }, url = "/deliveries") {
      try {
        const { data } = await Api().get(url);
        commit("setDeliveries", extractAttrs(data));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async deleteDeliveryAction({ dispatch }, id) {
      try {
        await Api().delete(`/deliveries/${id}`);
        dispatch("loadDeliveriesAction");
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadLastThreeDeliveriesAction({ dispatch }) {
      return dispatch("loadDeliveriesAction", "/deliveries?pagy=true&limit=3");
    },
    async loadGoogleMapDeliveriesAction({ commit }) {
      try {
        const { data } = await Api().get("/deliveries?status=delivering");
        commit("setGoogleMapDeliveries", extractMultipleDeliveriesAttrs(data));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadDelivery({ commit }, id) {
      try {
        const { data } = await Api().get(`/deliveries/${id}`);
        commit("setDelivery", extractSingleDeliveryAttrs(data));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async searchDeliveryAction(_, ttn) {
      try {
        const { data } = await Api().get(`/deliveries/search?ttn=${ttn}`);
        return extractSingleDeliveryAttrs(data);
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadDbDumpsAction({ commit }) {
      try {
        const { data } = await Api().get("/settings/dumps");
        commit("setDbDumps", extractAttrs(data));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async createNewDbDumpAction({ dispatch, commit }) {
      try {
        await Api().post("/settings/create_dump");
        dispatch("loadDbDumpsAction");
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async restoreDbDumpAction(_, id) {
      try {
        await Api().post(`/settings/restore_dump`, { id });
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async updateSslAction() {
      try {
        await Api().put("/settings/update_ssl");
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async loadAdsAction({ commit }, search = "") {
      try {
        const { data } = await Api().get(`/ads?search=${search}`);
        commit("setAds", extractAdsInformation(data));
      } catch (e) {
        return Promise.reject({
          error: e.response.data.errors[0].detail,
        });
      }
    },
    async loadAdAction({ commit }, id) {
      try {
        const { data } = await Api().get(`/ads/${id}`);
        commit("setAd", extractAdInformation(data));
      } catch (e) {
        return Promise.reject({
          error: e.response.data.errors[0].detail,
        });
      }
    },
    async createAdAction(_, form) {
      try {
        await Api().post("/ads", toSnakeCase(form));
      } catch (e) {
        return Promise.reject({ error: e.response.data.errors[0].detail });
      }
    },
    async completeAdAction({ commit }, id) {
      try {
        await Api().put(`/ads/${id}`, {
          completed: true,
        });
        commit("completeAd", id);
      } catch (e) {
                    return Promise.reject({
                      error: e.response.data.errors[0].detail,
                    });
                  }
    },
  },
  getters: {
    isAdmin(state: any) {
      return !!state.user.admin;
    },
    needHelp(state: any) {
      return !!state.user.needHelp;
    },
    locale(state: any) {
      return state.storeLocale || localStorage.getItem("locale") || "en";
    },
  },
});
