import { login } from '@/api/user';
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/utils/auth';

const getDefaultState = () => {
    return {
        token: getToken(),
        name: getName(),
        avatar: ''
    };
};

const state = getDefaultState();

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    }
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password })
                .then((response) => {
                    commit('SET_TOKEN', response.token);
                    commit('SET_NAME', response.nickName);
                    setToken(response.token, response.expired);
                    setName(response.nickName);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    /**
     * 退出登录
     * @param {*} param0
     */
    logout({ commit }) {
        commit('SET_TOKEN', '');
        commit('SET_NAME', '');
        removeToken();
        removeName();
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit('RESET_STATE');
            resolve();
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
