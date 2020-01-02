<template>
  <div id="odMain">
    <div class="oi-t"  >
      <div class="order-info">
        <div class="oiu">
          <div class="oi-l">
            <div class="oil-u">
              <span class="ycard" v-if="form.carLicenseColor==2">黄牌</span>
              <span class="ycard bcard" v-if="form.carLicenseColor==1">蓝牌</span>
              <span class="ycard ocard" v-if="form.carLicenseColor==3">其他牌</span>
              <span class="carCode">{{form.carLicenseNumber}}</span>
              <span class="oil-icon" @click="openChangeCarcode" v-if="form.status==1 && !isOthers">
                <img src="/static/images/oedit.png" alt />
              </span>
            </div>
            <div class="oil-m">
              <span class="ol-label">定位状态</span>
              <span class="openStatus" v-if="form.beiDouEnable">
                <van-icon name="success" color="#1493FF" />
                北斗
              </span>
              <span class="closeStatus" v-else>
                <van-icon name="info" color="#B0B0B0" />北斗
              </span>
              <span class="openStatus" v-if="form.lbsEnable" >
                <van-icon name="success" color="#1493FF" />
                LBS
              </span>
              <span class="openStatus" @click="openLBS" v-else>
                <!-- <van-icon name="success" color="#1493FF" /> -->
                开通LBS
              </span>
            </div>
            <div class="oil-d">
              <span class="ol-label" v-if="form.driverName">{{form.driverName}}</span>
              <span class="phone" @click="call(form.driverPhone)">{{form.driverPhone}}</span>
              <span class="oil-icon" @click="changePhoneFun" v-if="form.status==1 && !isOthers">
                <img src="/static/images/oedit.png" alt />
              </span>
            </div>
          </div>
          <div class="ol-r">
            <img :src="form.qrCodeUrl	" @click="listenerActionSheet" alt />
            <p>{{form.identificationCode}}</p>
          </div>
        </div>
        <div class="oid">
          <div class="oid-item">
            <span class="oid-icon">始</span>
            <p>{{form.originAddress}}</p>
          </div>
          <div class="oid-item">
            <span class="oid-icon oi-blue">终</span>
            <p>{{form.destinationAddress}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="dinfo">
      <!-- 地图 -->
      <div class="omap" v-if="form.status==1">
          <!-- :latitude="32.164418"
          :longitude="119.446448" -->
          <!-- show-location -->
        <map
          id="map"
          :latitude="latitude"
          :longitude="longitude"
          :controls="controls"
          :scale="11"
          @controltap="controltap"
          :markers="markers"
          @markertap="markertap"
          :polyline="polyline"
          @regionchange="regionchange"
          style="width: 100%; height: 300px;"
        ></map>
        <view class="btn-area">
          <button @click="getLocation">定位</button>
        </view>
      </div>

      <!-- <div class="search-txt st" style="position:relative; z-index: 33;" v-if="isTop && form.status==1"> <span class="st-img">
            <img src="/static/images/upscrow.png" alt />
          </span>上滑收起定位</div>
      <div class="search-txt st" style="position:relative; z-index: 33;" v-if="!isTop && form.status==1"> <span class="st-img">
            <img src="/static/images/downscrow.png" alt />
          </span>下拉展开定位</div> -->

      <!-- 定位记录 -->
      <div class="location-record">
        <div class="lr-tit">定位记录</div>

        <div>
        
        <view v-if='listArray.length>0' class='order_process v'>
          <block  v-for="(item1,index) in listArray" :key="index">
            <view class='h'>
              <view class='process v'>
                <!-- <image wx:if='{{index==0}}' class='process_icon' src="../../images/point.png"></image> -->
                <view v-if='index==0' class='process_line1Head'></view>
                <view v-if='index>0' class='process_line1'></view>
                <!--<image v-if='index==0' class='process_icon' src="../../static/images/deliveryOn.png"></image>-->
                <!--<image v-if='index>0' class='process_icon' src="../../static/images/deliveryOff.png"></image>-->
                <image v-if='index==0' class='process_icon' src="../../static/images/pointHead.png"></image>
                <view v-if='index>0' class='process_icon_point'></view>
                <view v-if='(index+1)<listArray.length' class='process_line2'></view>
                <view v-if='(index+1)==listArray.length' class='process_line2End'></view>
              </view>
              <view v-if="index==0" class='v' style="flex: 1">
                <text class='process_name_title '>{{item1.address}}</text>
              
                <text class='process_name_content ' >{{item1.time}}</text>
                <view style='height:20rpx;'></view>
              </view>
              <view v-if="index>0" class='v process_color3' style="flex: 1">
                <text class='process_name_title '>{{item1.address}}</text>
              
                <text class='process_name_content ' >{{item1.time}}</text>
                <view style='height:20rpx;'></view>
              </view>

            </view>

          </block>
        </view>
      </div>
      </div>

      <view class="btn-end" v-if="form.status==1 && !isOthers">
          <button @click="endFun" >结束</button>
        </view>

      <view class="btn-end" style="opacity:0.5" v-if="form.status==2 && !isOthers">
          <button disabled>已结束</button>
        </view>
  <div style="width:100%;height:200px;visibility: hidden;" v-if="listArray.length==0"></div>

    </div>

    <!-- 修改手机号 -->
    <van-dialog
      use-slot
      :async-close="true"
      :show="showChangePhone"
      show-cancel-button
      @close="onCloseChangePhone"
      title="修改手机号"
      @confirm="confirmChangePhone"
    >
      <van-field
        v-model="changePhoneNumber"
        input-align="left"
        label="手机号"
        maxlength="11"
        placeholder="请输入新手机号"
        @change="watchChangePhone"
      />
    </van-dialog>
    <!-- 修改车牌号 -->
    <van-dialog
      use-slot
      :async-close="true"
      :show="showChangeCarcode"
      show-cancel-button
      @close="onCloseChangeCarcode"
      title="修改车牌号"
      @confirm="confirmChangeCarcode"
    >
      <van-field v-model="changeCarcode" @change="watchCarcode" input-align="left" placeholder="请输入新车牌号" label="新车牌号"  required />
      <div style="position:relative;">
        <van-field input-align="left" label="车牌颜色" disabled required />
        <div
          style="position:absolute;top:10px;right:20px;z-index:3;border: 1px solid #DCDFE6;width:400rpx;"
        >
          <picker
            @change="filterChange"
            :value="filterIndex"
            :range="filterArray"
            style="position:relative;z-index:3;"
          >
            <view class="picker" style="font-size:14px;">{{filter}}</view>
          </picker>
          <span
            style="position:absolute;top:0;right:0;width:40rpx;height:40rpx;background: #DCDFE6;text-align:center;z-index:2;"
          >
            <van-icon name="arrow-down" />
          </span>
        </div>
      </div>
    </van-dialog>
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import api from "@/http/api/api.js";
import store from "../../store";
import Dialog from "~/vant/dialog/dialog";
import Toast from "~/vant/toast/toast";
import api_order from "@/http/api/api_order.js";
export default {
  data() {
    return {
      
      showChangePhone: false,
      showChangeCarcode: false,
      //选中的筛选项
      filterIndex: 0,
      //筛选的数组列表
      filterArray: ["蓝牌", "黄牌", "其他"],
      filter: "",
      changeColor:1,
      latitude: "",
      longitude: "",
      markers: [],
      listArray:[],
      isTop:true,
      //修改手机号
      changePhoneNumber:"",
      //车牌号
      carCode:"京KBT355",
      //车牌颜色
      carColor:"其他牌",
      //修改车牌号
      changeCarcode:"",
      id:null,
      isFirst:null,
      form:null,
      cacheUserInfo:null,
      isOthers:false,
      nowLocation:{
        latitude:"",
        longitude:"",
      },
      latitude:"",
      longitude:"",
       //筛选项距离上边的距离
      top: 0,
    };
  },
  onLoad() {
    // var that = this
    // that.scan();
    // this.id = JSON.parse(this.$root.$mp.query.id);
    // this.getLocation();
    this.filter = this.filterArray[0] ? this.filterArray[0] : "";
    console.log('onLoad');
    
  },
  onHide() {},
  onShow() {
     console.log('onShow');
     this.cacheUserInfo = wx.getStorageSync("cacheUserInfo") ? wx.getStorageSync("cacheUserInfo") : null;
     
    let self = this;
    this.filterIndex = 0;
    this.filter = this.filterArray[0] ? this.filterArray[0] : "";
      this.markers = [];
      this.isTop = true;
      this.longitude = null;
      this.latitude = null;
      this.form = null;
      this.listArray = [];
      this.latitude="32.164418"
       this.longitude="119.446448"
      this.id = JSON.parse(this.$root.$mp.query.id);
      this.isFirst=JSON.parse(this.$root.$mp.query.isFirst);
    this.initInfo();
    console.log('isFirst',this.$root.$mp.query.isFirst);
    
      if(this.isFirst){
        this.getLocation();
      }else{
        this.getLocationList();
      }
   
     
    console.log('isothers',this.isOthers);
    // this.initMap();
   
   
    
  },
   onUnload(){
    wx.switchTab({
      url: '/pages/order/main'
    })
  },
   onPageScroll: function(e) {
    
    console.log(e.scrollTop);
  },
  methods: {
    getLocationList(){
      api_order.GetLocationOrderHistoryPositionInfo(this.id).then(res => {
          if(res.data.length>0){
              this.listArray = res.data;
             
               this.nowLocation = {
                 latitude: res.data.slice(0,1)[0].latitude,
                    longitude: res.data.slice(0,1)[0].longitude,
                    address:res.data.slice(0,1)[0].address
               }
                this.latitude = this.nowLocation.latitude;
                this.longitude = this.nowLocation.longitude;
                this.markers = [
                  {
                    iconPath: "/static/images/mapl.png",
                    id: 0,
                    latitude:  res.data.slice(0,1)[0].latitude,
                    longitude: res.data.slice(0,1)[0].longitude,
                    width: 30,
                    height: 30,
                    callout: {
                      content: res.data.slice(0,1)[0].address,
                      bgColor: "#ffffff",
                      padding: "10",
                      display: "ALWAYS"
                    }
                  }
                ];
                    console.log('item',this.nowLocation);
          }else{
           this.latitude="32.164418"
             this.longitude="119.446448"
          }
      })
    },
    initInfo(){
      api_order.GetLocationOrderInfoById(this.id).then(res => {
        this.form = res;
        if(this.cacheUserInfo!=null){
       this.isOthers = this.cacheUserInfo.id==res.creatorId ? false : true;
     }
    })
    },
    listenerActionSheet() {
      // this.actionSheetHidden = false;
      let that =this;
       wx.previewImage({
        urls: [that.form.qrCodeUrl] // 需要预览的图片http链接列表
      })
    },
    
    //关闭修改手机号弹窗
    onCloseChangePhone(event) {
      console.log(event.mp.detail);
      if (event.mp.detail === "cancel") {
        // 异步关闭弹窗
        this.showChangePhone = false;
      }
    },
    /**下拉切换 */
    filterChange(e) {
      console.log(e);

      this.filterIndex = +e.target.value;
      this.filter = this.filterArray[this.filterIndex];
    this.changeColor = this.filterIndex+1;
      console.log('changeColor',this.changeColor);
      

    },
    //关闭修改车牌号弹窗
    onCloseChangeCarcode() {
      this.showChangeCarcode = false;
    },
    //打开修改手机号弹窗
    changePhoneFun() {
      this.changePhoneNumber = "";
      this.showChangePhone = true;
    },
    //打开修改车牌号弹窗
    openChangeCarcode() {
      this.changeCarcode = "";
      this.filter = this.filterArray[0] ? this.filterArray[0] : "";
      this.showChangeCarcode = true;
    },
    //地图
    /**视野发生变化时触发 */
    regionchange(e) {
      console.log(e.type);
    },
    //点击标记点时触发
    markertap(e) {
      console.log(e.markerId);
    },
    //点击控件时触发
    controltap(e) {
      console.log(e.controlId);
    },
    //定位
    getLocation() {
      console.log('chong');
      
      api_order.PutRelocateOrderPositionInfo(this.id).then(res => {
          if(res==null){
             api_order.GetLocationOrderHistoryPositionInfo(this.id).then(res => {
                if(res.data.length){
                    this.listArray = res.data;
                   
                  let latitude = res.data[0].latitude;
                  let longitude = res.data[0].longitude;
                  let address = res.data[0].address;
                  this.latitude = latitude;
                  this.longitude = longitude;
                this.markers = [
                  {
                    iconPath: "/static/images/mapl.png",
                    id: 0,
                    latitude: latitude,
                    longitude: longitude,
                    width: 30,
                    height: 30,
                    callout: {
                      content: address,
                      bgColor: "#ffffff",
                      padding: "10",
                      display: "ALWAYS"
                    }
                  }
                ];
                wx.showToast({
                            title: "定位成功",
                            icon: "success"
                          });
                  
                this.initInfo();
                }
            })
            
          }
      })
    },
    //结束
    endFun(){
       api_order
              .PutEndLocationOrderInfo(this.id)
              .then(res => {
                if (res == null) {
                  this.initInfo();
                  Toast("进行中的订单已结束");
                }
              });
    },
    //拨号
    call(phone){
       Dialog.confirm({
        title: "提示",
        message: `拨打电话${phone}`,
        confirmButtonText: "是",
        cancelButtonText: "否"
      })
        .then(() => {
          wx.makePhoneCall({
            phoneNumber: phone
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    //开通LBS
    openLBS(){
      api_order.PutEnableLBS(this.id).then(res => {
        Dialog.alert({
            title: '定位开通提示',
            message: '请求开通定位短信已发送给司机请等待司机同意后，刷新页面重新定位'
          }).then(() => {
          this.initInfo();
          });
      })
    },
    watchChangePhone(event){
      this.changePhoneNumber = event.mp.detail;
    },
    watchCarcode(event){
      this.changeCarcode = event.mp.detail;
    },
    //确认修改手机号
    confirmChangePhone:async function(event){
        let arg =  /^1[345678]\d{9}$/
        let slength = this.changePhoneNumber
        if(slength==""){
           Toast.fail("不能为空");
          this.showChangePhone = false
          return;
        }
        if(!arg.test(slength)){
        Toast.fail("格式错误");
        this.showChangePhone = false
        return;
        }
         let res = await api_order.PutUpdateDriverPhoneInfo(this.id,this.changePhoneNumber)
          wx.showToast({
               title: "修改手机号成功",
               icon: "success"
             });
             this.showChangePhone = false
             this.initInfo();
    },
    //确认修改车牌号
    confirmChangeCarcode:async function(){
      let arg =  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领a-zA-Z]{1}[a-zA-Z]{1}[a-zA-Z0-9]{4}[a-zA-Z0-9挂学警港澳]{1}$/
        let codelength = this.changeCarcode;
        let colorLength = this.filter;
        if(codelength==""){
           Toast.fail("车牌不为空");
          this.showChangeCarcode = false
           return;
        }
        if(!arg.test(codelength)){
          Toast.fail("车牌格式错误");
          this.showChangeCarcode = false
            return;
          }
        if(colorLength==""){
           Toast.fail("颜色不为空");
          this.showChangeCarcode = false
           return;
        }

        let res = await api_order.PutUpdateCarLicenseInfo(this.id,this.changeCarcode,this.changeColor)
        wx.showToast({
          title: "修改车牌号成功",
          icon: "success"
        });
        this.showChangePhone = false
        this.initInfo();
    }
  },
};
</script>

<style lang="scss" scoped>
.oi-t{
  // position: fixed;
  // z-index: 1000;
  // width: 100%;
  // top: 0;
  height:510rpx;
  margin: 0;
  padding: 0;  
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  background: #ffffff;
}
.order-info {
  margin-top: 6px;
  padding: 15px 10px;
  .oiu {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .oi-l {
      .oil-u {
        margin-bottom: 15rpx;
        .ycard {
          background: #fffaf0;
          border: 2px solid #ffb426;
          border-radius: 4px;
          border-radius: 4px;
          color: #ffb926;
          font-size: 12px;
          padding: 5rpx 7rpx;
        }
        .bcard {
          background: #f0f8ff;
          border: 2px solid #71c6ff;
          color: #1493ff;
        }
        .ocard {
          background: #f4f4f4;
          border: 2px solid #242424;
          color: #333333;
        }
        .carCode {
          font-family: PingFangSC-Medium;
          color: rgba(0, 0, 0, 0.7);
          display: inline-block;
          margin: 0 10rpx;
        }
      }
      .oil-icon {
        img {
          width: 13px;
          height: 15px;
        }
      }
      .ol-label {
        color: rgba(0, 0, 0, 0.7);
        font-family: PingFangSC-Regular;
        display: inline-block;
        margin-right: 15rpx;
      }
      .oil-m {
        margin-bottom: 15rpx;
        .closeStatus {
          background: #ededed;
          border: 2px solid #c8c8c8;
          border-radius: 4px;
          border-radius: 4px;
          font-size: 12px;
          padding: 5rpx 7rpx;
          align-items: center;
          color: #a9a9a9;
          margin-right: 15rpx;
        }
        .openStatus {
          background: #cee7ff;
          border: 2px solid #20a5ff;
          border-radius: 4px;
          border-radius: 4px;
          font-size: 12px;
          padding: 5rpx 7rpx;
          align-items: center;
          color: #1493ff;
          margin-right: 15rpx;
        }
      }
      .oil-d {
        .phone {
          color: #ff7900;
          margin-right: 15rpx;
        }
      }
    }
    .ol-r {
      text-align: center;
      img {
        width: 70px;
        height: 70px;
      }
      p {
        font-size: 12px;
        color: #797979;
      }
    }
  }
  .oid {
    .oid-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10rpx;
      min-height: 48px;
      .oid-icon {
        display: inline-block;
        background: #ff9500;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        line-height: 20px;
        margin-right: 20px;
      }
      .oi-blue {
        background: #1493ff;
      }
      p {
        color: rgba(0, 0, 0, 0.7);
        width: 85%;
        overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      }
    }
  }
}
.omap {
  // margin-top: 10px;
  background: #ffffff;
  padding: 10px;
  height: 300px;
  position: relative;
  .btn-area {
    bottom: 0%;
    height: 47px;
    background: #1493ff;
    letter-spacing: -0.43px;
    text-align: center;
    // width: 80%;
    margin: 10px auto 0 auto;
    position: absolute;
    right: 10px;
    top: 0;
    border-radius: 4px;
    button {
      background: inherit;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #ffffff;
      border-radius: 6px;
    }
     button::after{
    border: none;
  }
  }
}
.search-txt {
  font-family: PingFangSC-Regular;
  color: #bbbbbb;
  letter-spacing: 0.26px;
  text-align: center;
  margin: 6px 0;
}
.location-record{
  background: #ffffff;
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
  .lr-tit{
    color: rgba(0,0,0,0.70);
    border-bottom: 1px solid #E3E3E3;
    font-family: PingFangSC-Medium;
    padding-bottom: 10rpx;
  }
}
.v{
  display: flex;
  flex-direction: column;
}
.h{
    display: flex;
    flex-direction: row;
  }

.order_process {
  display: flex;
  flex-wrap: nowrap;
  padding: 10rpx 10rpx 20rpx 10rpx;
  background-color: #fff;
}

.process_wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
  }

  .process {
    display: flex;
    align-items: center;
    width: 100rpx;
  }

  .process_icon {
    width: 30rpx;
    height: 30rpx;
  }
  .process_icon_point {
    width: 14rpx;
    height: 14rpx;
    border-radius:50%;
    background: #E0E4E7;
  }

  .process_line1Head {
    /*background: #eff3f6;*/
    flex: 1;
    width: 0;
    height: 35rpx;
  }
  .process_line1 {
    /*background: #eff3f6;*/
     flex: 1;
    width: 0;
    height: 35rpx;
    border-left:#999999 2rpx dotted;
  }
  .process_line2 {
    /*background: #eff3f6;*/
    flex: 1;
    width: 0;
    border-left:#999999 2rpx dotted;
  }
  .process_line2End {
    /*background: #eff3f6;*/
    flex: 1;
    width: 0;
  }
  .process_color1{
    color: #333;
  }
  .process_color2{
    color: #BF0909;
  }
  .process_color3{
    color: #999;
  }

  .process_name_title {
    font-size: 30rpx;
    margin-top: 30rpx;
  }
  .process_name_content {
    font-size: 24rpx;
    margin-top: 15rpx;
  }
  .orderPoint {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e0e4e7;
  }

.btn-end {
  bottom: 0%;
  height: 47px;
  background: #FF3100;
  letter-spacing: -0.43px;
  text-align: center;
  width: 80%;
  margin: 10px auto 15px auto;
  button {
    background: inherit;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #ffffff;
    border-radius: 6px;
    border:none!important;
  }
  button::after{
    border: none;
  }
}
.st-img {
  display: inline-block;
  img {
    width: 15px;
    height: 15px;
  }
}
.st {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dinfo{

  position: absolute;
  overflow-y: auto;
  top: 540rpx;
    bottom: 0px;
    left: 0px;
    width: 100%;
}
#odMain{
  height: 100%;
  width: 100%;
}
</style>
