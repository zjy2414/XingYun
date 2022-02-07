import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

const store = new Vuex.Store({
    state: {
        token: "token-xxx-yyy",
        access_token: "",
        refresh_token: "",
        akID: "",
        akSecret: "",
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setAccessToken(state, access_token) {
            state.access_token = access_token
        },
        setRefreshToken(state, refresh_token) {
            state.refresh_token = refresh_token
        },
        setAkID(state, akID) {
            state.akID = akID
        },
        setAkSecret(state, akSecret) {
            state.akSecret = akSecret
        },
    },
    plugins: [vuexLocal.plugin]
})

export default store