import {IS_USER_AUTHENTICATED, GET_JWT_TOKEN, GET_USER_INFO} from "../storeconstants";

export default {
    [IS_USER_AUTHENTICATED](state) {
        return state.isLoggedIn;
    },

    [GET_JWT_TOKEN](state) {
        return state.jwtToken;
    },
    [GET_USER_INFO](state) {
        return state.user;
    }
}