<template>
	<div class="prepare" v-if="isShow">
		<a class="back" @click="back"></a>
		<ul class="form-content">
			<li class="form-item">
				<span class="icon"></span>
				<input type="text" class="form-input" placeholder="房间号" v-model="roomId" @input="checkRoomId" maxlength="32">
			</li>
			<li class="form-item">
				<span class="icon"></span>
				<input type="text" class="form-input" placeholder="用户id" v-model="userId" @input="checkUserId" maxlength="32">
			</li>
		</ul>
		<button class="live-btn" @click="goToLive">我要开播</button>
		<p class="alias" @click="goToLive">跳过，直接开播</p>
	</div>
</template>

<script>
import config from '../config/octopus.config.js';
export default {
	props: ["isShowPrepare", "defaultSettings"],
	data() {
		return {
			roomId: '',
			userId: ''
		}
	},
	computed: {
		isShow: {
			get() {
				return this.isShowPrepare;
			},
			set(value) {
				this.$emit('update:isShowPrepare', value);
			}
		},
		settings: {
			get() {
				return this.defaultSettings;
			},
			set(value) {
				this.$emit('update:defaultSettings', value);
			}
		}
    },
	mounted() {
		
	},
	methods: {
		checkRoomId(e) {
			this.roomId = this.roomId.replace(/-/i, '');
			if (this.roomId.length > 32) {
				this.$toast({
					content: '长度不能超过32位哦~'
				});
				return false;
			}
		},
		checkUserId(e) {
			this.userId = this.userId.replace(/-/i, '');
			if (this.userId.length > 32) {
				this.$toast({
					content: '长度不能超过32位哦~'
				});
				return false;
			}
		},
		checkFormat() {

		},
		goToLive() {
			console.log('get params:::', this.roomId,  this.userId, this.settings);
			this.$router.push({name: 'Meet', params: {
				source: 1, 
				roomId: this.roomId,
				userId: this.userId,
				config: {
					...this.settings,
					...config[this.defaultSettings.env]
				}
			}});
		},
		back() {
			this.isShow = false;
		}
	}
}
</script>
<style scoped lang="less">
.prepare{
	width: 510px;
	height: 580px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -300px 0 0 -255px;
	background:rgba(255,255,255,1);
	border-radius:6px;
	.back{
		width: 26px;
		height: 26px;
		background: url("../assets/images/back.png") no-repeat;
		background-size: cover;
		position: absolute;
		top: 20px;
		left: 20px;
	}
	.form-content{
		width: 100%;
		margin-top: 107px;
		padding: 0 24px;
		box-sizing: border-box;
		.form-item{
			width: 100%;
			height: 48px;
			border-bottom: 1px solid #dddddd;
			display: flex;
			align-items: center;
			margin-top: 26px;
			.icon{
				width: 27px;
				height: 27px;
				background-image: url("../assets/images/room-icon.png");
				background-repeat: no-repeat;
				background-size: cover;
				margin-right: 20px;
			}
			&:nth-child(2){
				.icon {
					background-image: url("../assets/images/user-icon.png");
				}
			}
			.form-input{
				background:none;  
				outline:none;  
				border:0px;
				font-size:20px;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:28px;
				width: 100%;
			}
		}
	}
	.live-btn{
		width:360px;
		height:60px;
		background:rgba(17,205,168,1);
		border-radius:4px;
		font-size:20px;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:60px;
		text-align: center;
		margin-top: 72px;
	}
	.alias{
		width:100%;
		height:28px;
		font-size:20px;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:28px;
		text-align: center;
		margin-top: 24px;
	}
}
@media screen and (max-height: 900px) {
	.prepare{
		width: 450px;
		height: 500px;
		margin-top: -250px;
		margin-left: -225px;
	}
}
</style>
