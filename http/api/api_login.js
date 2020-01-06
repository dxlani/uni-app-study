import fly from '../fly.js'
export default {
    /**
     * 登录
     */
    login: function (data) {
        return fly.post('/api/Account/Login',data)
    },
    /**
     * 发送验证码
     */
    getCaptChas: function(phone){
        return fly.get('/api/Account/GetCaptchas?PhoneNumber=' + phone + '&isDeveloper=false')
    }

}