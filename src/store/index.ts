import Vue from 'vue'
import Vuex from 'vuex'
import { toSnakeCase } from '@/utils/helpers'
import { Api, extractAttrs, extractSingleDeliveryAttrs, extractMultipleDeliveriesAttrs } from '@/utils/helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    users: [],
    deliveries: [],
    googleMapDeliveries: [],
    delivery: {
      route: [],
      drugs: []
    },
    dbDumps: []
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setUsers(state, payload) {
      state.users = payload
    },
    setDeliveries(state, payload) {
      state.deliveries = payload
    },
    setGoogleMapDeliveries(state, payload) {
      state.googleMapDeliveries = payload
    },
    setDelivery(state, payload) {
      state.delivery = payload
    },
    setDbDumps(state, payload) {
      state.dbDumps = payload
    }
  },
  actions: {
    async loginUserAction(_, form: object): Promise<object> {
      try {
        const { data } = await Api().post('/sign_in', toSnakeCase(form))
        localStorage.setItem('token', data.meta.token)
        return Promise.resolve(data)
      } catch (e: any) {
        console.log(e.response)
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async signUpUserAction(_, form: object): Promise<object> {
      try {
        const { data } = await Api().post('/users', toSnakeCase(form))
        return Promise.resolve(data)
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async loadUserProfileAction({ commit }) {
      try {
        const { data } = await Api().get('/users/me')
        commit('setUser', data.data.attributes)
        return Promise.resolve(data)
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async loadUsersAction({ commit }) {
      try {
        const { data } = await Api().get('/users')
        commit('setUsers', extractAttrs(data))
        return Promise.resolve(data)
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async updateUserAction(_, form) {
      try {
        const { data } = await Api().put(`/users/${form.user.id}`, toSnakeCase(form))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async createDeliveryAction(_, form) {
      try {
        await Api().post('/deliveries', toSnakeCase(form))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async loadDeliveriesAction({ commit }, url = '/deliveries') {
      try {
        const { data } = await Api().get(url)
        commit('setDeliveries', extractAttrs(data))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      } 
    },
    async deleteDeliveryAction({ dispatch }, id) {
      try {
        await Api().delete(`/deliveries/${id}`)
        dispatch('loadDeliveriesAction')
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      } 
    },
    async loadLastThreeDeliveriesAction({ dispatch }) {
      return dispatch('loadDeliveriesAction', '/deliveries?pagy=true&limit=3')
    },
    async loadGoogleMapDeliveriesAction({ commit }) {
      try {
        const { data } = await Api().get('/deliveries?status=delivering')
        commit('setGoogleMapDeliveries', extractMultipleDeliveriesAttrs(data))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async loadDelivery({ commit }, id) {
      try {
        const { data } = await Api().get(`/deliveries/${id}`)
        commit('setDelivery', extractSingleDeliveryAttrs(data))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      } 
    },
    async searchDeliveryAction(_, ttn) {
      try {
        const { data } = await Api().get(`/deliveries/search?ttn=${ttn}`)
        return extractSingleDeliveryAttrs(data)
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      } 
    },
    async loadDbDumpsAction({ commit }) {
      try {
        const { data } = await Api().get('/settings/dumps')
        commit('setDbDumps', extractAttrs(data))
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async createNewDbDumpAction({ dispatch, commit }) {
      try {
        await Api().post('/settings/create_dump')
        dispatch('loadDbDumpsAction')
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    },
    async restoreDbDumpAction(_, id) {
      try {
        await Api().post(`/settings/restore_dump`, { id })
      } catch (e: any) {
        return Promise.reject({ error: e.response.data.errors[0].detail })
      }
    }
  },
  getters: {
    isAdmin(state: any) {
      return !!state.user.admin
    },
    locale() {
      return localStorage.getItem('locale') || 'en'
    }
  }
})
