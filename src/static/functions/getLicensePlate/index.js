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
    url: `https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=` + event.access_token,
    qs: {
      image:"",
      multiDetect:"",
      access_token:""
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };
  const resultValue = await requestpromise(AccessToken_options);
  return {event,resultValue}

}




