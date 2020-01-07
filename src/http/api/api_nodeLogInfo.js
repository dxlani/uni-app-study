import fly from '../fly.js'
export default {
  // barCode	string
  // 条码号
  // equipmentInfoId	string
  // 设备外键(暂不需要)
  // handle	string
  // 最后处理人
  // handleName	string
  // 处理人名称
  // userId	string
  // 处理人Id  PUT
  //扫码
  PutUpdateNodeLogInfo: function (barCode,handle,handleName,userId) {
    return fly.put('/api/NodeLogInfo/PutUpdateNodeLogInfo',{barCode,handle,handleName,userId})
  },
  //jobno string
  //name string
  //time string '2019-03-12'
  //根据用户ID查询扫码记录
  GetMyNodeLogInfoList: function (jobno , name , time) {
    return fly.get('/api/NodeLogInfo/GetMyNodeLogInfoList?jobno='+ jobno +'&name='+ name +'&time='+ time)
  },
}
