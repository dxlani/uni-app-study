/*
 * @Autor: dingxiaolin
 * @Date: 2020-08-07 22:11:04
 * @LastEditors: dingxiaolin
 * @LastEditTime: 2020-09-17 00:22:40
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
ci.preview({
  project,
  version,
  desc,
  setting: {
    es6: true,
  },
  qrcodeFormat: 'image',
  qrcodeOutputDest: './preview.jpg',
  onProgressUpdate: console.log,
  // pagePath: 'pages/index/index', // 预览页面
  // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
}).then(res => {
  console.log('预览succ',res)
}).catch(error => {
  console.log('预览err',error)
  process.exit(-1)
})
