import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'
import user from './modules/user'
import { abilityPlugin, ability as appAbility } from './ability'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT } from './actions'
import { USER_REQUEST } from './actions/user'
import apiCall from 'utils/api'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export const ability = appAbility
export const store = new Vuex.Store({
  plugins: [
    storage({
      storedKeys: ['token', 'rules', 'status', 'hasLoadedOnce'],
      destroyOn: ['AUTH_LOGOUT']
    }),
    abilityPlugin
  ],

  modules: {
    user
  },

  state: {
    token: '',
    rules: [],
    status: '',
    hasLoadedOnce: false
  },

  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    authToken: state => state.token,
  },

  mutations: {
    [AUTH_REQUEST]: (state) => {
      state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, resp) => {
      state.status = 'success'
      state.token = resp.token
      state.rules = resp.rules
      state.hasLoadedOnce = true
    },
    [AUTH_ERROR]: (state) => {
      state.status = 'error'
      state.hasLoadedOnce = true
    },
    [AUTH_LOGOUT]: (state) => {
      state.token = ''
      state.rules = []
    }
  },

  actions: {
    [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_REQUEST)
        apiCall({ url: '/api/auth/login', data: user, method: 'POST' })
          .then(resp => {
            localStorage.setItem('user-token', resp.token);
            Vue.http.headers.common['x-access-token'] = resp.token;
            commit(AUTH_SUCCESS, resp)
            dispatch(USER_REQUEST)
            resolve(resp)
          })
          .catch(err => {
            commit(AUTH_ERROR, err)
            localStorage.removeItem('user-token')
            reject(err)
          })
      })
    },
    [AUTH_LOGOUT]: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_LOGOUT)
        localStorage.removeItem('user-token')
        Vue.http.headers.common['x-access-token'] = null;
        resolve()
      })
    }
  }
})
