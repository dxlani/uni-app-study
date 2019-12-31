import fly from '../fly.js'
export default {
    getUserInfo: function (id) {
        return fly.get('/api/userManage/GetUserById?id=' + id)
    },
}