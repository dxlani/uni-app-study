var Fly =  require("flyio/dist/npm/wx")
var fly = new Fly(); //创建fly实例
import store from '../store'
//设置超时
fly.config.timeout = 10000;

//配置请求基地址

// #ifdef H5
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境');
	fly.config.baseURL = "/" //代理
	// fly.config.baseURL = "http://192.168.2.32:5000"  //姚正才
}else{
    console.log('生产环境')
	fly.config.baseURL = "https://cds.vip56.cn"
}
// #endif

// #ifndef H5
fly.config.baseURL = "https://test-newcdsenterprise.vip56.cn"
// fly.config.baseURL = "http://192.168.2.32:5000"  //姚正才
// #endif
 


fly.interceptors.request.use((request, promise) => {
    var that = this;
    //自定义请求头
    var jwtToken = store.state.jwtToken;
    request.headers["Authorization"] = `Bearer ${jwtToken}`;
    return request;
})
fly.interceptors.response.use((response, promise) => {
    var url = response.request.url
    console.log("url", url)
    //str.indexOf("3") != -1
    if (url.indexOf("/api/OrderInfo/PutUpdateSweepCode2") != -1) { //扫码接口
        console.log("这是扫码接口")
        return Promise.resolve(response.data)
    }
    //只将请求结果的data字段返回
    if (response.data.errorMessage) {
        if (response.data.errorCode == "10001") {
            let that = this;
            wx.showModal({
                title: "提示",
                content: response.data.errorMessage,
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        wx.clearStorage("cacheUserInfo")
                        wx.clearStorage("cacheToken")
                        wx.reLaunch({
                            url: '/pages/login/main'
                        })
                    }
                }
            });
        }
        if (response.data.errorCode == "110005") {
            wx.showModal({
                title: "提示",
                content: response.data.errorMessage,
                showCancel: false,
            });
            return Promise.resolve(response.data.data);
        }
        else {
            wx.showModal({
                title: "提示",
                content: response.data.errorMessage,
                showCancel: false,
            });
            console.log(response.data.errorCode);

            return Promise.reject(response.data.errorMessage)
        }
    } else {
        return Promise.resolve(response.data.data); //标准化
    }
},
    (err, promise) => {
        //发生网络错误后会走到这里
        wx.showToast({
            title: "网络开小差了，请稍后重试",
            icon: "none"
        })
    })

export default fly




// 使用demo:
// request.login({
//     password:"123456",
//     userName:"货准达测试账户",
//     weChatOpenid:""
//  }).then(res=>{
//    console.log(res)
//  })
//get请求可以也可传obj，序列化数据。 //  test?id=123
//  request.test({
//     id: 133
//  })
