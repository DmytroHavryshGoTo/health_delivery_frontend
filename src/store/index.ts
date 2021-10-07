import Vue from 'vue'
import Vuex from 'vuex'
import { toSnakeCase } from '@/utils/helpers'
import { Api, extractAttrs } from '@/utils/helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    users: []
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setUsers(state, payload) {
      state.users = payload
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
        commit('setUsers', extractAttrs(data.data))
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
