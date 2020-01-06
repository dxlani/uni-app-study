// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request');
const requestpromise = require('request-promise');
// var https = require('https');
// var qs = require('querystring');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const AccessToken_options = {
    method: 'POST',
    url: 'https://aip.baidubce.com/oauth/2.0/token',
    qs: {
      grant_type: 'client_credentials',
      client_id: 'jzGnIvW8RIhA2vBQSipBPhZF',
      client_secret: 'vrlLunAxAbrCIuqRVCuMwbaLikhCDFVs',
    },
    json: true
  };
  const resultValue = await requestpromise(AccessToken_options);
  console.log('d', resultValue.access_token)
  const AccessToken_options2 = {
    method: 'POST',
    url: `https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=` + resultValue.access_token,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form:
    {
      image: event.image
    }
    ,
    json: true
  };
  const resultValue2 = await requestpromise(AccessToken_options2)
  console.log('ds', resultValue2)

  return resultValue2

}




