import {
    SET_AUTHENTICATION,
    SET_JWT_TOKEN,
    SET_USER_INFO
} from "../storeconstants";

export default {

    [SET_AUTHENTICATION](state, isLoggedIn) {
        state.isLoggedIn = isLoggedIn
    },
    [SET_JWT_TOKEN](state, token) {
        state.jwtToken = token
    },
    [SET_USER_INFO](state, user) {
        state.user = user
    },
}