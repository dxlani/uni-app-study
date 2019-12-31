import * as types from './mutation-type'

const mutations = {
    // [方法名](参数1,参数2...){方法}
    // 给state赋值
    [types.getJwtToken](state, value) {
        state.jwtToken = value
    },
}

export default mutations;