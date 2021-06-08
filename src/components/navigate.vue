<!--
 * @Date: 2020-06-16 15:16:43
 * @LastEditors: GWK
 * @LastEditTime: 2020-06-23 11:02:19
 * @FilePath: /Web_Demo/src/components/navigate.vue
--> 
<template>
	<div class="nav">
		<div class="logo"></div>
		<div class="nav-content" v-if="isShowContent">
			<span class="">{{$t('m.roomID')}}: {{navRoomId}}</span>
			<span class="">{{$t('m.userID')}}: {{navUserId}}</span>
		</div>
		<div class="text" v-else>
			{{$t('m.cooperation')}}：develop@linkv.sg
		</div>
	</div>
</template>

<script>
export default {
	props: ['isShowContent', 'roomId', 'userId'],
	computed: {
		navRoomId: {
			get() {
				return this.roomId;
			},
			set(value) {
				this.$emit('update:roomId', value)
			}
		},
		navUserId: {
			get() {
				return this.userId;
			},
			set(value) {
				this.$emit('update:userId', value)
			}
		}
	}
}
</script>

<style scoped lang="less">
.nav{
	width: 100%;
	height: 113px;
	background:rgba(255,255,255,1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	z-index: 1;
	.logo{
		width: 219px;
		height: 82px;
		background: url("../assets/images/logo_ico.png") no-repeat;
		background-size: 100%;
	}
	.nav-content{
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.text{
		width:210px;
		height:20px;
		font-size:14px;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:20px;
		margin-right: 50px;
	}
}
@media screen and (max-height: 900px) {
    .nav {
        height: 90px;
    }
}
@import "../assets/css/mobile/nav.less";
</style>
