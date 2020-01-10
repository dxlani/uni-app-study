<template>
  <view id="mine">
    <view class="mine-head" @click='changeImg'>
      <!-- <open-data type="userAvatarUrl" class="user-img" v-if="user.imgSrc===''"></open-data> -->
      <!-- <image class="user-img" :src='user.imgSrc' v-if="user.imgSrc!==''"></image> -->
      <image class="user-img" :src='user.imgSrc'></image>
    </view>
    <view class="mine-name">
      <label>{{user.name}}</label>
    </view>
    <view class="mine-code">
      <label>{{user.code}}</label>
    </view>
    <view class="mine-profession">
      <!-- <van-cell
          title="工种"
          custom-class="profession-row"
          title-class="profession-title"
          value-class="profession-value"
          :value="user.profession"
          is-link arrow-direction="down"
          url="/pages/profession/main"/> -->
      <van-cell
        title="角色"
        custom-class="profession-row"
        title-class="profession-title"
        value-class="profession-value"
        :value="user.profession"/>
    </view>
    <view class="mine-record">
      <van-cell
        title="扫码记录"
        custom-class="record-row"
        title-class="record-title"
        is-link
        url="/pages/scanCodeRecord/main"/>
    </view>
	<van-swipe-cell :right-width="60" >
	  <van-cell-group>
	    <van-cell title="切换语言" :value="usinglang" />
	  </van-cell-group>
	  <view slot="right">
		  <van-button type="primary" @click="switchlang">{{otherlang}}</van-button>
	  </view>
	  <!-- <view slot="right">删除
	   </view>-->
	</van-swipe-cell>

    <view class="row-btn">
      <button type="primary" class="logout-btn" @click="logout">{{$t('mine.logOut')}}</button>
    </view>
  </view>
</template>
<script>
  import store from '../../store'
  import * as types  from '@/store/mutation-type'
  import api from '@/http/api/api.js'
  export default {
    data () {
      return {
		  usinglang:'',
		  otherlang:'',
        user:{
          id:'',
          imgSrc:'',
          name:'',
          code:'',
          profession:'',
          phone:'',
		  
        }
      }
    },
    created () {

    },
    onLoad(){
		if(this._i18n.locale=="zh"){
			this.usinglang="中文";
			this.otherlang="英文";
		}else {
			this.usinglang="英文";
			this.otherlang="中文";
		}
	   uni.setNavigationBarTitle({
	   			title: this.$i18n.messages[this.$i18n.locale].tabBar.me
	   });
    },
    onShow(){
      this.getInfo()
    },
    methods: {
      /**
       * 获取用户信息
       */
      getInfo(){
        const that = this;
        that.user.id = store.state.id;
        that.user.code = store.state.number;
        api.GetEnterpriseById().then((res)=>{
          that.user.name = res.name;
          this.$store.state.id = res.id
          this.$store.state.enterpriseId = res.enterpriseId
          this.$store.state.number = res.number
          this.$store.state.name = res.name
          this.$store.state.phone = res.phone
          this.$store.state.roleId = res.roleId
          this.$store.state.userSource = res.userSource
          this.$store.state.roleName = res.roleName
          this.$store.state.isDisable = res.isDisable
          if(res.roleName === ''||!res.roleName){
            that.user.profession = "待认证";
          }else{
            that.user.profession = res.roleName;
          }
          that.user.imgSrc = '/static/images/moren.png'
          // switch(res.jobScopes){
          //   case'0': that.user.imgSrc = '/static/images/moren.png'
          //     break;
          //   case'1': that.user.imgSrc = '/static/images/planner.png'
          //     break;
          //   case'2': that.user.imgSrc = '/static/images/lingliao.png'
          //     break;
          //   case'3': that.user.imgSrc = '/static/images/zhijian.png'
          //     break;
          //   case'4': that.user.imgSrc = '/static/images/wuliu.png'
          //     break;
          //   case'5': that.user.imgSrc = '/static/images/wuliucompany.png'
          //     break;
          //   case'6': that.user.imgSrc = '/static/images/shouhuo.png'
          //     break;
          //   case'7': that.user.imgSrc = '/static/images/jingxiao.png'
          //     break;
          // }
        });
      },
      /**
       * 工种页面跳转判断
       */
      toProfession(){
        if(this.user.profession === "待认证"){
          wx.navigateTo({
            url: '/pages/confirmProfession/main'
          })
        }else{
          wx.navigateTo({
            url: '/pages/profession/main'
          })
        }
      },
      /**
       * 编辑头像图片
       */
      changeImg(){
        // const that = this;
        // wx.chooseImage({
        //     count: 1,
        //     sizeType: ['original', 'compressed'],
        //     sourceType: ['album', 'camera'],
        //     success(res) {
        //         var tempFilePaths = res.tempFilePaths;
        //         upLoad(tempFilePaths,res=>{
        //             // console.log('res',res)
        //             that.user.imgSrc = res[0];
        //         })
        //     }
        // })
      },
      /**
       * 退出登录
       */
      logout(){
        this.$store.commit(types.getJwtToken,'');
        this.$store.state.id = ''
        this.$store.state.enterpriseId = ''
        this.$store.state.number = ''
        this.$store.state.name = ''
        this.$store.state.phone = ''
        this.$store.state.roleId = ''
        this.$store.state.userSource = ''
        this.$store.state.roleName = ''
        this.$store.state.isDisable = false
        wx.clearStorage("cacheUserInfo")
        wx.clearStorage("cacheToken")
        // console.log(store.state)
        wx.reLaunch({
          url: '/pages/login/main'
        })
      },
	  switchlang(){
		  console.log('test',this._i18n.locale)
	  	if(this._i18n.locale=="zh"){
	  		this._i18n.locale='en';
			this.usinglang="英文";
			this.otherlang="中文";
	  	}else {
	  		this._i18n.locale="zh";
			this.usinglang="中文";
			this.otherlang="英文";
	  	}
	  	const lang = this.$i18n.locale;
	  	uni.setTabBarItem({
	  				index: 0,
	  				text: this.$i18n.messages[lang].tabBar.scanCode
	  	});
	  	uni.setTabBarItem({
	  				index: 1,
	  				text: this.$i18n.messages[lang].tabBar.order
	  	});
	  	uni.setTabBarItem({
	  				index: 2,
	  				text: this.$i18n.messages[lang].tabBar.me
	  	});
	  	uni.setNavigationBarTitle({
	  				title: this.$i18n.messages[lang].tabBar.me
	  	});
	  },
    },
	
  }
</script>
<style>
  .profession-row,
  .record-row,
  .phone-row{
    font-family: PingFangSC-Regular;
    line-height: 64rpx!important;
  }
  .profession-title,
  .record-title,
  .phone-title{
    font-size: 28rpx;
    color: #333333;
    letter-spacing: 0.42rpx;
    padding-left: 34rpx;
  }
  .profession-value,
  .phone-value{
    font-size: 28rpx;
    color: #999;
    letter-spacing: 0.42rpx;
    padding-right: 40rpx;
  }
</style>

<style scoped>
  #mine{
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #E6E6E6;
  }
  .mine-head{
    display: flex;
    flex-direction: column;
    width:100%;
    height: 170rpx;
    margin:11.6% auto 0rpx;
  }
  .user-img{
    width: 168rpx;
    height: 168rpx;
    border-radius:50%;
    overflow:hidden;
    margin:0rpx auto;
  }
  .mine-name{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 3%;
    align-items: center;
    margin:5% auto 0rpx;
    font-family: PingFangSC-Semibold;
    font-size: 28rpx;
    color: #333;
    letter-spacing: 0.42rpx;
  }
  .mine-code{
    display: flex;
    flex-direction: column;
    width:100%;
    align-items: center;
    height: 3%;
    margin:1.6% auto 0rpx;
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    color: #666;
    letter-spacing: 0.42rpx;
  }
  .mine-profession{
    margin-top:6%;
  }
  .row-btn{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 60.5%;
    height: 80rpx;
    position: absolute;
    left:19.75%;
    bottom:6%;
  }

  .logout-btn{
    width:100%;
    height: 80rpx;
    line-height: 80rpx;
    background: #E6E6E6;
    border-radius: 8rpx;
    border: 2rpx solid #999999;
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    letter-spacing: 0.36rpx;
    color: #999;
  }
</style>



