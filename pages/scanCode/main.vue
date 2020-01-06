<template>
  <div id="scanCode">
    <img class="img"
         src="../../static/images/bg.png">
    <div class="btn"
         @click="scan">
      <img style="width:24px;height:24px;margin-right:24rpx"
           src="../../static/images/saoma-2.png">
      <view>扫描标识码</view>
    </div>
  </div>
</template>

<script>
import api from '../../http/api/api.js'
import store from '../../store'
export default {
  data () {
    return {
      latitude: '',
      longitude: '',
      result: {},
      location: '',
    }
  },
  onLoad () {
    // var that = this
    // that.scan();
  },
  onHide () {

  },
  onShow () {
    var that = this;
    wx.getLocation({
      success (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        api.GetAddress(res.latitude, res.longitude).then((res) => {
          that.location = res.address
          // console.log(res)
        })

      }
    })
  },
  methods: {
    scanSuccess (e) {
      var that = this;
      that.result = e.result
      wx.showLoading({
        title: '加载中...',
      })
      api.GetOrder(that.result).then(res => {
       
        let orderNumber;
        if(res != null) {
          orderNumber = res.number;
        }
        
        api.GetUserNodeList(that.result, store.state.id).then(res => {
          wx.hideLoading();
          for (let i of res) {
            i.type = "default"
          }
          res[0].type = 'warning';
          let param = {
            identificationCode: that.result,
            location: that.location,
            data: res,
            orderNumber: orderNumber
          }
          wx.navigateTo({
            url: "/pages/confirmNode/main?param=" + JSON.stringify(param)
          })
        }).catch(() => {
          wx.hideLoading();
          
          // wx.showLoading({
          //     title: '未知错误',
          // })
          // setTimeout(()=>{
          //     // wx.hideLoading();
          //     wx.switchTab({
          //         url: "/pages/scanCode/main"
          //     })
          // },1500)

        })
      }).catch((res) => {
        wx.hideLoading();
        // console.log(res)
      })
    },
    scan () {
      var that = this;
     //#ifndef H5
      wx.scanCode({
        success: (res) => {
          // wx.hideLoading();
          that.scanSuccess(res)
        }
      })
	 //#endif 
    },
  }
}
</script>

<style>
page {
  width: 100%;
  height: 100%;
}
.btn {
  width: 640rpx;
  margin-top: 96rpx;
  background: rgb(255, 149, 0);
  display: flex;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 3px;
}
#scanCode {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*border: 1px solid red;*/
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
.img {
  width: 175px;
  height: 135px;
  margin-top: -128rpx;
}
.light_style {
  position: absolute;
  top: 172rpx;
  left: 353rpx;
  width: 45rpx;
  height: 48rpx;
}

.camera {
  width: 100%;
  height: 100%;
}

.class2 {
  position: absolute;
  width: 170px;
  height: 190px;
  top: 260px;
  left: 208px;
  box-shadow: rgba(0, 0, 0, 0.6) 0 0 0 1366px;
}

.shadow {
  flex: 1;
  background-color: #000000;
  opacity: 0.4;
}

.shadow-mid {
  width: 100%;
  height: 570rpx;
  display: flex;
  flex-direction: row;
}

.shadow-lr {
  width: 88rpx;
  height: 100%;
}

.line {
  position: absolute;
  top: 284rpx;
  left: 110rpx;
  height: 2px;
  width: 530rpx;
  background: white;
  /*transform: translateY(580rpx);*/
  /*background: url(img/share/dapai.png) no-repeat; !*上下扫的线*!*/
  /*动画效果*/
  /*animation: myScan 2s infinite alternate;*/
  /*animation: myScan 2s infinite alternate;*/
  /*-webkit-animation: myScan 2s infinite alternate;*/
  transition: All 2s linear;
  -webkit-transition: All 2s linear;
  /*transform: translateY(580rpx);*/
}

.activeDown {
  transform: translateY(560rpx);
}

.des {
  ont-family: PingFangSC-Regular;
  font-size: 24rpx;
  color: #f0f0f0;
  letter-spacing: 0.36px;
  text-align: center;
  margin-top: 60rpx;
}

.des2 {
  ont-family: PingFangSC-Regular;
  font-size: 32rpx;
  color: #000000;
  letter-spacing: 0.36px;
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

@-webkit-keyframes myScan {
  /*0% { top: 284rpx;}*/
  /*100% { top: 850rpx;}*/
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(285);
  }
}

@keyframes myScan {
  /*0% { top: 284rpx;}*/
  /*100% { top: 850rpx;}*/
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(285);
  }
}

.controls {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.controls1 {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.result {
  font-size: 10px;
  color: rgb(12, 242, 240);
  text-align: center;
}
.van-button--warning {
  background: rgb(255, 149, 0) !important;
}
</style>
