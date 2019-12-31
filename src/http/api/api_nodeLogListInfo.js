import fly from '../fly.js'
export default {
  //获取扫码节点
  //nodeLogInfoId string
  GetNodeLogListInfoList: function (nodeLogInfoId) {
    return fly.get('/api/NodeLogListInfo/GetNodeLogListInfoList?nodeLogInfoId='+ nodeLogInfoId)
  },
}
