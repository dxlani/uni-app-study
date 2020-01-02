<template>
    <view id="login">
        <image class="loginBg" src="../../static/images/loginBg.png"></image>
        <view class="logo">
            <image class="logo-img" src="../../static/images/logo1.png" />
        </view>
        <!-- <view class="row-class">
            <view class="user">
                <image class="user-img" src="/static/images/login_user.png" />
            </view>
            <input class="input-class" :value="user.userCode" @input="getCode" placeholder="请输入工号" placeholder-class="input-placeholder">
        </view> -->
      <view class="row-class">
        <view class="inputBg" style="flex: 1;">
          <input class="input-class" :value="user.userCode" @input="getCode" placeholder="请输入企业编号" placeholder-style="color:#fff;">
        </view>
      </view>
        <view class="row-class">
            <view class="inputBg" style="flex: 1;">
              <input class="input-class" :value="user.phoneNumber" @input="getPhone" placeholder="请输入手机号" placeholder-style="color:#fff;">
            </view>
        </view>
        <view class="row-class">
            <!--<view class="password">-->
                <!--<image class="password-img" src="/static/images/login_password.png" />-->
            <!--</view>-->
          <view class="inputBg" style="flex: 1;">
            <input class="input-class" type="number" :value="user.captChasCode" @input="getYzm" placeholder="请输入验证码" placeholder-style="color:#fff;">
          </view>
            <view class="message">
              <button v-if="nullHouse" type="warn" class="login-btn" @click="getMessage">
			   <text class="test">&#xe639;</text>
			   <van-icon name="close" />
				{{btnMessage}}</button>
              <button v-if="!nullHouse" type="warn" class="login-btn" disabled>{{second}}s后重新获取</button>
            </view>
        </view>
        <view class="row-btn">  
            <button type="warn" class="login-btn" @click="login">登录</button>
        </view>
		// #ifndef H5
		<van-button type="primary" >vant 按钮组件</van-button>
        // #endif
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
    </view>
</template>

<script>
import api from '@/http/api/api.js'
import api_order from "@/http/api/api_order.js";
import * as types  from '@/store/mutation-type'
import Toast from "@/wxcomponents/vant/toast/toast";
import Dialog from "@/wxcomponents/vant/dialog/dialog";
export default {
    components: {

    },
    data () {
        return {
            user: {
                userCode:'',
                phoneNumber: "",
                captChasCode: "",
            },
            timeT:"",
            btnMessage: '获取验证码',
            second: 60,
            nullHouse: true,
            telNumber: "0511-81882550",
        }
    },

    created () {
        this.reset()
    },
    onShow(){
        let cacheUserInfo = wx.getStorageSync("cacheUserInfo") ? wx.getStorageSync("cacheUserInfo") : null;
        let cacheToken = wx.getStorageSync("cacheToken") ?  wx.getStorageSync("cacheToken") : null;
        // if(cacheToken!=null && cacheUserInfo!=null){
        //     console.log('cacheUserInfo',cacheUserInfo);
        //     console.log('cacheToken',cacheToken);
        //     this.$store.commit(types.getJwtToken,cacheToken);
        //     this.$store.state.id = cacheUserInfo.id
        //     this.$store.state.enterpriseId = cacheUserInfo.enterpriseId
        //     this.$store.state.number =cacheUserInfo.number
        //     this.$store.state.name = cacheUserInfo.name
        //     this.$store.state.phone = cacheUserInfo.phone
        //     this.$store.state.roleId = cacheUserInfo.roleId
        //     this.$store.state.userSource = cacheUserInfo.userSource
        //     this.$store.state.roleName = cacheUserInfo.roleName
        //     this.$store.state.isDisable = cacheUserInfo.isDisable
        //      wx.reLaunch({
        //         url: '/pages/scanCode/main'
        //     })
        // }
        
        // this.user.userCode = '190008'
        // this.user.phoneNumber = '18083781768'

    },
    onUnload(){
        this.reset();
    },

    methods: {
        getCode(e){
            this.user.userCode = e.mp.detail.value
        },
        getPhone(e){
            this.user.phoneNumber = e.mp.detail.value
        },
        getYzm(e){
            this.user.captChasCode = e.mp.detail.value
        },
        reset(){
            this.user.userCode = '190001'
            this.user.phoneNumber = '183447170'
            this.user.captChasCode = '7136'
            this.btnMessage  = '获取验证码'
            this.second = 60
            this.nullHouse = true        
            clearInterval(this.timeT)
        },
        /**
         * 发送验证码
         */
        getMessage(){
            if((/^1[345678]\d{9}$/.test(this.user.phoneNumber))){
              api.SendCaptchas(this.user.phoneNumber).then((res)=>{
                    this.nullHouse = false;
                    this.timer();
                })
            }else{
				// Dialog.confirm({
				//   title: "提示",
				//   message: `有1个进行中的订单`,
				//   confirmButtonText: "前往查看",
				//   cancelButtonText: "结束并创建新订单",
				//   overlay:true
				// })
				
				// uni.showModal({
				// 	title: '提示',
				// 	content: '有1个进行中的订单',
				// 	cancelText: '结束',
				// 	confirmText: '前往查看',
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
				
				Toast("请输入11位有效手机号");
            }
        },
        /**
         * 定时器
         */
        timer(){
            this.timeT = setInterval(()=>{
                this.second = this.second - 1;
                // console.log(this.second)
                if(this.second <= 0){
                    this.btnMessage = "重新获取";
                    this.nullHouse = true;
                    this.second = 60;
                    clearInterval(this.timeT);
                }
            },1000)
        },
        /**
         * 登录
         */
        login(){
            if(this.user.userCode === ""){
                uni.showToast({
					    title: "请输入工号",
					    icon: "none"
				});
                return;
            }else
            if(!(/^1[345678]\d{9}$/.test(this.user.phoneNumber))){
                uni.showToast({
					    title: "请输入11位有效手机号",
					    icon: "none"
				});
                return;
            }else if(this.user.captChasCode === ""){
                uni.showToast({
					    title: "请输入有效验证码",
					    icon: "none"
				});
                return;
            }else{
                api.login(this.user.userCode,this.user.phoneNumber,this.user.captChasCode).then(res=>{
                 console.log("test",res,this.$store)
                        this.$store.commit(types.getJwtToken,res.token);
                        this.$store.state.id = res.userInfo.id
                        // this.$store.state.id = 'a99585ab-6c3c-4583-9055-dab6371c513e'
                        this.$store.state.enterpriseId = res.userInfo.enterpriseId
                        this.$store.state.number = res.userInfo.number
                        this.$store.state.name = res.userInfo.name
                        this.$store.state.phone = res.userInfo.phone
                        this.$store.state.roleId = res.userInfo.roleId
                        this.$store.state.userSource = res.userInfo.userSource
                        this.$store.state.roleName = res.userInfo.roleName
                        this.$store.state.isDisable = res.userInfo.isDisable
                        wx.setStorageSync("cacheUserInfo", res.userInfo);
                        wx.setStorageSync("cacheToken", res.token);

                        wx.reLaunch({
                            url: '/pages/scanCode/main'
                        })
                }).catch(function (error) {

                 });
            }
        },
        /**
         * 拨打电话
         */
        call(){
            wx.makePhoneCall({
                phoneNumber: this.telNumber,
            })
        }
    }
}
</script>
<style>
.getCode-btn{
    width: 200rpx;
    height: 45rpx!important;
    line-height: 45rpx!important;
    border-left: 2rpx solid #808080!important;
    border-top: none!important;
    border-right: none!important;
    border-bottom: none!important;
    border-radius: 0rpx!important;
    font-size:24rpx!important;
    background-color: #f5f5f5!important;
    padding-left: 5px!important;
    padding-right: 5px!important;
    text-align: center!important;
    color: #333;
}

</style>
<style scoped>
#login{
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fff;
}
.logo{
    display: flex;
    flex-direction: column;
    width:100%;
    height: 300rpx;
    z-index:100;
}
.loginBg{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
}
.logo-img{
  width: 500rpx;
  height: 70rpx;
  display: flex;
    /* width:100%;
    height: 100%; */
    margin:auto auto 60rpx;
}
.row-class{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 74.7%;
    height: 90rpx;
    margin:4.4% auto 0rpx;
}
.inputBg{
  border-radius: 6rpx;
  background-color:rgba(0, 0, 0, 0.4);
  z-index:10;
}
.user,
.phone,
.password{
    width: 90rpx;
    height: 90rpx;
    background-color: #D8D8D8;
}
.message{
    display:flex;
    align-items:center;
    height: 120rpx;
    margin-left: 20rpx;
    background-color: #f5f5f5;
    padding:0 auto;
}
.user-img,
.phone-img,
.password-img{
    width: 30rpx;
    height: 36rpx;
    margin:27rpx 30rpx;
}
.input-class{
    width:100%;
    line-height:90rpx;
    height: 90rpx;
    padding-left:15px;
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    letter-spacing: 0;
    background-color: none;
  color: #ffffff;
}

.input-placeholder{
    color: #ffffff;
}
.row-btn{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 74.7%;
    height: 90rpx;
    margin:18.3% auto 0rpx;
}

.login-btn{
    width:100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #BF0909;
    border-radius: 8rpx;
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    letter-spacing: 0;
}

.row-tip{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 74.7%;
    height: 33rpx;
    line-height: 33rpx;
    margin:0rpx auto ;
    position: absolute;
    left:12.7%;
    bottom: 5%;
}
.tip-head{
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    color: #888888;
    letter-spacing: 1rpx;
}
.tip-number{
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    color: #C00E0E;
    letter-spacing: 0;
    line-height: 33rpx;
}

</style>
