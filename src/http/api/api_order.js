import fly from '../fly.js'
export default {
    //获取登录用户创建的定位订单列表
    GetLocationOrderInfoList: function (carLicenseNumber,driverPhone,skip,count) {
        return fly.get('/api/WxLocationOrderInfo/GetLocationOrderInfoList' ,{carLicenseNumber,driverPhone,skip,count})
    },
    //添加定位订单
    PostAddLocationOrderInfo: function (data) {
        return fly.post('/api/WxLocationOrderInfo/PostAddLocationOrderInfo' ,data)
    },
    //获取定位车辆记录信息
    GetLogInfoByCarLicense: function (carLicenseNumber,carLicenseColor) {
        return fly.get('/api/WxLocationCarLogInfo/GetLogInfoByCarLicense' ,{carLicenseNumber,carLicenseColor})
    },
    //获取定位订单详情
    GetLocationOrderInfoById: function (locationOrderId) {
        return fly.get('/api/WxLocationOrderInfo/GetLocationOrderInfoById/' + locationOrderId )
    },
    //获取指定车辆关联的处于进行中状态的定位订单
    GetLocationOrderInfoInProcess: function (carLicenseNumber,carLicenseColor) {
        return fly.get('/api/WxLocationOrderInfo/GetLocationOrderInfoInProcess',{carLicenseNumber,carLicenseColor} )
    },
    //结束定位订单
    PutEndLocationOrderInfo: function (locationOrderId) {
        return fly.put('/api/WxLocationOrderInfo/PutEndLocationOrderInfo/'+ locationOrderId )
    },
    //修改定位订单车牌相关信息
    PutUpdateCarLicenseInfo: function (locationOrderId,carLicenseNumber,carLicenseColor) {
        return fly.put('/api/WxLocationOrderInfo/PutUpdateCarLicenseInfo',{locationOrderId,carLicenseNumber,carLicenseColor} )
    },
    //修改定位订单司机手机号
    PutUpdateDriverPhoneInfo: function (locationOrderId,driverPhone) {
        return fly.put('/api/WxLocationOrderInfo/PutUpdateDriverPhoneInfo',{locationOrderId,driverPhone} )
    },
    //定位订单开通LBS定位
    PutEnableLBS: function (locationOrderId) {
        return fly.put('/api/WxLocationOrderInfo/PutEnableLBS/'+locationOrderId )
    },
     //获取定位订单详情
     GetLocationOrderInfoByIdentificationCode: function (identificationCode) {
        return fly.get('/api/WxLocationOrderInfo/GetLocationOrderInfoByIdentificationCode/' + identificationCode )
    },
     //获取定位订单车辆历史定位信息
     GetLocationOrderHistoryPositionInfo: function (locationOrderId) {
        return fly.get('/api/WxLocationOrderInfo/GetLocationOrderHistoryPositionInfo/' + locationOrderId )
    },
    //定位订单车辆重定位
    PutRelocateOrderPositionInfo: function (locationOrderId) {
        return fly.put('/api/WxLocationOrderInfo/PutRelocateOrderPositionInfo/' + locationOrderId )
    },
    //根据ID获取企业信息
    GetEnterpriseById: function (id) {
       return fly.get('/api/Enterprise/GetEnterpriseById' ,{id} )
   },
}