<template>
	<div class="video">
		<video 
			class="video-element" 
			:id="videoId" 
			:muted="videoMuted" 
			:srcObject.prop="videoStream"
			autoplay
			playsinline>
		</video>
		<div class="video-poster" v-if="isShowPoster"></div>
		<a class="video-btn" :class="{pause: isShowPause}" @click="play" v-if="isShowPlay"></a>
		<!-- <a class="video-btn" :class="{pause: isShowPause}" @click="play"></a> -->
	</div>
</template>

<script>
export default {
	props: ['videoId', 'videoMuted', 'loadingVideo', 'loadingAvatarFilter', 'stream'],
	data() {
		return {
			isShowPlay: false,
			isShowPause: false,
			isShowPoster: true
		}
	},
	computed:{
		isShowLoading: {
			get() {
				return this.loadingVideo;
			},
			set(value) {
				this.$emit('update:loadingVideo', value)
			}
		},
		isShowFilter: {
			get() {
				return this.loadingAvatarFilter;
			},
			set(value) {
				this.$emit('update:loadingAvatarFilter', value)
			}
		},
		videoStream: {
			get() {
				console.log('video stream:::', this.stream);
				return this.stream;
			},
			set() {
				this.$emit('update:stream', value)
			}
		}
	},
	mounted() {
		// this.isShowPlay = true;
		console.log('mounted:::', this.videoMuted, document.getElementById(this.videoId));
		document.getElementById(this.videoId).addEventListener('abort', () => {
			console.log('video abort')
		});
		document.getElementById(this.videoId).addEventListener('canplay', () => {
			console.log('video canplay');
			this.isShowPoster = false;
			this.isShowPlay = true;
		});
		document.getElementById(this.videoId).addEventListener('play', () => {
			this.isShowPoster = false;
			this.isShowPlay = false;
			console.log('video play')
		})
		document.getElementById(this.videoId).addEventListener('pause', () => {
			this.isShowPlay = true;
			console.log('video pause');
		})
	},
	methods: {
		play() {
			// this.$emit('get-video-status', !this.isShowPause);
			// if (this.isShowPause) {
			// 	console.log('~~~ false');
			// 	this.isShowPause = false;
			// 	document.getElementById(this.videoId).pause();
			// } else {
			// 	console.log('~~~ true');
			// 	this.isShowPause = true;
			// 	document.getElementById(this.videoId).play();
			// }
			this.isShowPause = true;
			setTimeout(() => {
				document.getElementById(this.videoId).play();
				this.isShowPause = false;
				this.isShowPlay = false;
			}, 500);
		}
	}
}
</script>

<style scoped lang="less">
.video{
	width: 100%;
	height: 100%;
	position: relative;
	.video-element{
		width: 100%;
		height: 100%;
		// transform: scaleX(-1); 
	}
	.video-poster{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url("../assets/images/avatar.png") no-repeat;
		background-size: 40%;
		background-position: center;
		filter: blur(8px);
	}
	// 兼容ios12 多个video播放暂停
	.video-btn {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -30px;
		margin-top: -30px;
		display: block;
		width: 60px;
		height: 60px;
		background: url("../assets/images/play.png") no-repeat;
		background-size: cover;
		&.pause{
			background-image: url("../assets/images/pause.png");
		}
	}
}

</style>
