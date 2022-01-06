const state = {
    analysis: null,
}


const mutations = {
    CHANGE_NAV: (state, data) => {
        state.analysis = data
    }
}

const actions = {
    changeNav({ commit }, data) {
        commit('CHANGE_NAV', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
