import fly from '../fly.js'
export default {
    changeProfession: function (data) {
        return fly.post('/api/userManage/SubChangeJob',data)
    },
}