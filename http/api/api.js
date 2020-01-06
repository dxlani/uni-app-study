import fly from '../fly.js'
export default {
    /**
     * 登录
     */
    login: function(number, phone, smscode) {
        return fly.get('/api/UserLogin/GetLoginuser', { number, phone, smscode })
    },
    /**
     * 发送验证码
     */
    SendCaptchas: function(phone) {
        return fly.get('/api/UserLogin/SendCaptchas?phonenumber=' + phone + '&isDeveloper=false')
    },
    /**
     * 获取用户信息
     */
    GetEnterpriseById: function() {
        return fly.get('/api/UserInfo/GetEnterpriseById' )
    },
    /**
     * 扫码接口
     */
    PutUpdateSweepCode: function(identificationCode, userId, location, remarks) {
        return fly.put('/api/OrderInfo/PutUpdateSweepCode', { identificationCode, userId, location, remarks })
    },
    /**
     * 根据用户ID 查询扫码信息列表
     */
    GetWxNodeLogInfoListByUserId: function( IdentificationCode, time, skip, count) {
        return fly.get('/api/OrderInfo/GetWxNodeLogInfoListByUserId', {  IdentificationCode, time, skip, count })
    },
    /**
     * 小程序码上追溯
     */
    GetWxNodeLogInfoList: function(IdentificationCode) {
        return fly.get('/api/NodeLogInfo/GetWxNodeLogInfoList', { IdentificationCode })
    },
    /**
     * 根据订单获取物流追踪信息
     */
    GetNodeLogInfoList: function(OrderId) {
        return fly.get('/api/NodeLogInfo/GetNodeLogInfoList', { OrderId })
    },
    /**
     * 根据经纬度获取地址信息
     */
    GetAddress: function(latitude, longitude) {
        return fly.get('/api/OrderInfo/GetAddress', { latitude, longitude })
    },
    /**
     * 根据标识获取订单信息
     */
    GetOrder: function(IdentificationCode) {
        return fly.get('/api/OrderInfo/GetOrder', { IdentificationCode })
    },
    /**
     * 扫码之前的验证
     */
    GetSweepCodeCheck: function(IdentificationCode, UserId) {
        return fly.get('/api/OrderInfo/GetSweepCodeCheck', { IdentificationCode, UserId })
    },
    /**
     * 获取可操作节点列表
     */
    GetUserNodeList: function(IdentificationCode, userid) {
        return fly.get('/api/OrderInfo/GetUserNodeList', { IdentificationCode, userid })
    },
    /**
     * 记录节点
     */
    PutUpdateSweepCode2: function(identificationCode, userId, nodeId, location, remarks) {
        return fly.put('/api/OrderInfo/PutUpdateSweepCode2', { identificationCode, userId, nodeId, location, remarks })
    },
    /**
     * 记录节点
     */
    getAccessToken: function(clientId, clientSecret) {
        return fly.post(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`, {clientId, clientSecret })
    },
    getLicensePlate: function(image, multiDetect,access_token) {
        return fly.post(`https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=`+access_token, {image, multiDetect },{ headers:{'Content-Type':'application/x-www-form-urlencoded'}})
        //直接调用request函数发起post请求
        // return fly.request("https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate",{image, multiDetect},{
        //     method:"post",
        //     timeout:5000 //超时设置为5s
            
        //  })
        // .then(d=>{ console.log("request result:",d)})
        // .catch((e) => console.log("error", e))
    },
    
}