<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef MP-WEIXIN
				if (!wx.cloud) {
				    console.error('请使用 2.2.3 或以上的基础库以使用云能力');  
				} else {  
				   wx.cloud.init({
				       env:'cds-05oft',
				       traceUser: true
				     }) 
				}  
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css,nvue不支持全局样式 */
	@import url("./iconfont.scss");
</style>
