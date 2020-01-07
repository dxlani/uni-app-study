import * as types from './mutation-type'
export default {
    //commit 触发mutation
    getJwtToken: ({ commit }) => commit(types.getJwtToken, data)
}