import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './auth/index'

export default createStore( {
  state: {
    errorMessage: "",
    infoMessage: ""
  },
  getters: {
    getErrorMessage: (state) => state.errorMessage,
    getInfoMessage: (state) => state.infoMessage,
  },
  mutations: {
    setErrorMessage(state, payload) {
        state.errorMessage = payload;
    },
    setInfoMessage(state, payload) {
        state.infoMessage = payload;
    },
  },
  actions: {
  },
  modules: {
    auth
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    })]
} )