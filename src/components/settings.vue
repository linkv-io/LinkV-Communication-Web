<template>
	<div class="settings" v-if="isShow">
		<div class="header">
			<span class="title">{{$t('m.setting')}}</span>
			<a class="close-btn" @click="close"></a>
		</div>
		<ul class="list">
			<li 
				class="item" 
				v-for="(item, index) in settingArrList" 
				:key="index">
				<label class="text" for="platform"> {{item.name}}: </label>
				<div class="form-select">
					<div class="form-title">
						<input 
							class="form-input" 
							name="platform" 
							readonly
							@click="toSelectFun(index)" 
							v-model="item.checked.value"
							:disabled="item.disabled"
							/>
						<i class="fole-icon" :class="{fold: !item.fold}"></i>
					</div>
					<ul class="form-list" v-if="!item.fold">
						<li 
							class="form-item"
							@click="selectItem(index, subindex)" 
							v-for="(cell, subindex) in item.options" 
							:key="subindex"
							>
							{{cell.value}}
						</li>
					</ul>
				</div>	
			</li>
		</ul>
	</div>
</template>

<script>
import settingConfig from '../config/setting.config';
import { mapState, mapMutations, mapActions } from "vuex";

export default {
	props: ['isShowSet', 'source', 'isSettingShowVideoDeviceOptions', 'deviceConfigObj'],
	data() {
		return {
			settingResult: {},
			settingArr: [],
			devicesList: []
		}
	},
	computed: {
		isShow: {
			get() {
				return this.isShowSet;
			},
			set(value) {
				this.$emit('update:isShowSet', value);
			}
		},
		settingArrList() {
			return this.settingArr.filter((item) => {
				return item.show;
			});
		},
		...mapState(['storeSettingsConfig', 'scene'])
	},
	watch: {
		scene(n) {
			// 场景切换时 每个选项需要重置状态
			if (!this.currentSettingConfig || Object.keys(this.currentSettingConfig).length == 0) {
				return;
			}
			this.switchState(n);
		},
		isSettingShowVideoDeviceOptions(n, o) {
			if (n) {
				this.currentSettingConfig.videoDevices.disabled = false;
				this.currentSettingConfig.resolution.disabled 	= false;
			} else {
				this.currentSettingConfig.videoDevices.disabled = true;
				this.currentSettingConfig.resolution.disabled 	= true;
			}
		}
	},
	async mounted() {
		this.pageRender();
	},
	methods: {
		async pageRender() {
			await this.pageLoad();
			this.settingArr = Object.values(this.currentSettingConfig);
			if (this.source == 'home') {
				this.getEmitSettingConfig();
			}
			console.log('render:::', this.settingArr);
		},
		async pageLoad() {
			// 从缓存中取出配置文件
			let cacheStore = this.storeSettingsConfig;
			console.log('get setting config:::', this.storeSettingsConfig, Object.keys(this.storeSettingsConfig));
			let getSettingConfig;
			if (Object.keys(this.storeSettingsConfig).length == 0) {
				getSettingConfig = await this.addSettingConfig();
			} else {
				getSettingConfig = cacheStore;
			}
			if (this.source == 'home') {
				getSettingConfig.type.disabled 	= false;
				// getSettingConfig.env.disabled 	= false;
			} else if (this.source == 'meet') {
				getSettingConfig.type.disabled 	= true;
				// getSettingConfig.env.disabled 	= true;
			}

			console.log('getCurrentSettingConfig:::', getSettingConfig);
			this.currentSettingConfig = getSettingConfig;
			this.switchState();
		},
		async addSettingConfig() {
			if (this.devicesList.length == 0 || !this.devicesList[0].label) {
				this.devicesList = await this.getDeviceList();
			}
			// 获取设备列表并添加到配置项中
			if (
				settingConfig.audioDevices.options.length == 0 ||
				settingConfig.videoDevices.options.length == 0
			) {
				for (let item of this.devicesList) {
					if (item.kind == 'audioinput' && item.label.length !== 0) {
						settingConfig.audioDevices.options.push({
							key: item.deviceId,
							value: item.label
						})
					}

					if (item.kind == 'videoinput' && item.label.length !== 0) {
						settingConfig.videoDevices.options.push({
							key: item.deviceId,
							value: item.label
						})
					}
				}
			}

			// 添加每个配置项的默认值和控制是否显示项、是否置灰
			for (let key in settingConfig) {
				const cell = settingConfig[key];
				cell.checked = cell.options.length !== 0 ? cell.options[0] : '';
				cell.show = true;
				cell.disabled = false;
				cell.fold = true;
			}
			// 生成当前页面总配置文件,并存入本地缓存
			this.$store.commit('setSettingsConfig', settingConfig);
			return settingConfig;
		},
		switchState() {
			console.log('current scene::', this.scene);
			switch (this.scene) {
				case 'share':
					this.currentSettingConfig.videoDevices.disabled = true;
					this.currentSettingConfig.audioDevices.disabled = true;
					this.currentSettingConfig.resolution.disabled 	= false;
					break;
				case 'video':
					this.currentSettingConfig.videoDevices.disabled = false;
					this.currentSettingConfig.audioDevices.disabled = false;
					this.currentSettingConfig.resolution.disabled 	= false;
					break;
				case 'audio':
					this.currentSettingConfig.videoDevices.disabled = true;
					this.currentSettingConfig.audioDevices.disabled = false;
					this.currentSettingConfig.resolution.disabled 	= true;
					break;
				default:
					if (this.currentSettingConfig.audioDevices.options.length == 0) {
						this.currentSettingConfig.audioDevices.show = false;
					}

					if (this.currentSettingConfig.videoDevices.options.length == 0) {
						this.currentSettingConfig.videoDevices.show = false;
					}
					this.currentSettingConfig.resolution.disabled 	= false;
					console.log('home setting config:::', this.currentSettingConfig);
					break;
			}
		},
		async getDeviceList() {
			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				console.log("不支持 enumerateDevices() .");
				return;
			}
			return await navigator.mediaDevices.enumerateDevices();
		},
		toSelectFun(index) {
			let currentSelect = this.settingArrList[index];
			if (!this.settingArrList[index].fold) {
				this.settingArrList[index].fold = true;
			} else {
				this.settingArrList.forEach((value, key, arr) => {
					value.fold = true;
					this.$set(this.settingArrList, key, value);
				});
				this.settingArrList[index].fold = false;
			}
			this.$set(this.settingArrList, index, this.settingArrList[index]);
		},
		selectItem(index, subindex) {
			const selectedItem 		= this.settingArrList[index];
			const selectOptions		= selectedItem.options[subindex];
			selectedItem.checked 	= selectOptions;
			selectedItem.fold 		= true;
			this.$set(this.settingArrList, index, selectedItem);

			// 根据选择项决定disable项
			// 用户选择纯音频模式
			if (selectedItem.key == 'type') {
				this.settingArrList.forEach((value, index) => {
					if ( selectOptions.key == 1) {
						this.$store.commit('updateScene', 'audio');
					} else if (selectOptions.key == 0) {
						this.$store.commit('updateScene', 'video');
					}
				})
			}
			// 记录更改配置
			this.currentSettingConfig[selectedItem.key].checked = selectOptions;
		},
		getEmitSettingConfig() {
			let getResultSetting = {};
			for (let i in this.currentSettingConfig) {
				const item = this.currentSettingConfig[i];
				getResultSetting[i] = item.checked.key;
			}
			console.log('emit settings::', getResultSetting);
			this.$emit('get-settings', getResultSetting);
			// this.$store.commit('setResultSettingConfig', this.getResultSetting); //////////
		},
		close() {
			this.isShow = false;
			console.log('click close....', this.currentSettingConfig);
			this.getEmitSettingConfig();
			this.$store.commit('setSettingsConfig', this.currentSettingConfig);
		}
	}
}
</script>

<style scoped lang="less">
.settings {
	width:466px;
	height:562px;
	background:rgba(37,41,46,0.8);
	border-radius:6px;
	position: absolute;
	left: 50%;
	top: 50%;
	// margin-left: -233px;
	// margin-top: -281px;
	transform: translate(-50%, -50%);
	padding: 25px;
	z-index: 2;
	.header{
		text-align: left;
		.title{
			font-weight: 500;
			color:rgba(255,255,255,1);
			line-height:28px;
			font-size:20px;
		}
		.close-btn{
			position: absolute;
			width: 38px;
			height: 38px;
			background: url("../assets/images/setting-close.png") no-repeat;
			background-size: cover;
			top: 25px;
			right: 25px;
		}
	}
	.list{
		font-weight:400;
		color:rgba(255,255,255,1);
		margin-top: 20px;
		.item {
			width: 100%;
			list-style: none;
			height: 70px;
			// line-height: 70px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.form-select{
				position: relative;
				width: 260px;
				.form-title{
					position: relative;
					.form-input{
						width: 100%;
						height: 40px;
						background-color:rgba(103,104,105,0.8);
						border-radius:4px;
						appearance:none;
						-moz-appearance:none;
						-webkit-appearance:none;
						padding-right: 44px;
						padding-left: 14px;
						position: relative;
						box-sizing: border-box;
						outline: none;
						font-size: 14px;
						&::-ms-expand { display: none; }
					}
					.fole-icon{
						position: absolute;
						display: block;
						right: 14px;
						width: 14px;
						height: 8px;
						background: url("../assets/images/arrow.png") no-repeat;
						background-size: 100%;
						top: 50%;
    					margin-top: -4px;
						&.fold{
							transform: rotate(180deg);
							transition: .5s;
						}
					}
				}
				.form-list{
					position: absolute;
					width: 100%;
					background:rgba(125,126,126,1);
					border-radius:0px 0px 4px 4px;
					z-index: 1; 
					.form-item{
						height: 40px;
						line-height: 40px;
						border-bottom: 1px solid #cccccc;
						text-align: left;
						padding-left: 15px;
						font-size: 14px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						&:last-child{
							border-bottom: none;
						}
					}
				}
			}
		}
	}
}
@media screen and (max-height: 900px) {
	.settings{
		width: 450px;
		height: auto;
		// margin-top: -250px;
		// margin-left: -225px;
	}
}
@import "../assets/css/mobile/settings.less";
</style>
