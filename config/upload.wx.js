/*
 * @Autor: dingxiaolin
 * @Date: 2020-08-07 22:11:04
 * @LastEditors: dingxiaolin
 * @LastEditTime: 2020-08-07 22:50:36
 */
const ci = require('miniprogram-ci')
let { wxVersion: version, wxDesc: desc } = require('../package.json').wx

if (!version) version = 'v1.0.0'
if (!desc) desc = new Date() + '上传'

const project = new ci.Project({
  appid: 'wx0f12a6d8945a08a4',
  type: 'miniProgram',
  projectPath: process.cwd() + '/dist/build/mp-weixin',
  privateKeyPath: process.cwd() + '/config/key/private.wx0f12a6d8945a08a4.key',
  ignores: ['node_modules/**/*'],
})
ci.upload({
  project,
  version,
  desc,
  setting: {
    es6: true,
  },
  robot:30,
  onProgressUpdate: console.log,
}).then(res => {
  console.log(res)
  console.log('上传成功')
}).catch(error => {
  if (error.errCode == -1) {
    console.log('上传成功')
  }
  console.log(error)
  console.log('上传失败')
  process.exit(-1)
})
