import mutations from './mutations';
import getters from './getters';

export default {
    namespaced: true,
    state() {
        return {
            isLoggedIn: false,
            jwtToken: "",
            user: {}
        }
    },
    mutations,
    getters
}