<template>
	<div class="audio">
		<audio 
		class="audio-element" 
		:class="{filter: isFilter}" 
		:id="audioId" 
		:muted="videoMuted" 
		:srcObject.prop="videoStream"
		:autoplay="!videoMuted">
		</audio>
	</div>
</template>

<script>
export default {
	props: ['audioId', 'videoMuted', 'isShowFilter', 'stream'],
	data() {
		return {

		}
	},
	computed: {
		isFilter: {
			get() {
				console.log('filter0000:::', this.isShowFilter);
				return this.isShowFilter;
			},
			set(value) {
				this.$emit('update:isShowFilter', value);
			}
		},
		videoStream: {
			get() {
				return this.stream;
			},
			set() {
				this.$emit('update:stream', value)
			}
		}
	},
	mounted() {
		console.log('mounted:::');
		document.getElementById(this.audioId).addEventListener('abort', () => {
			console.log('video abort')
		});
		document.getElementById(this.audioId).addEventListener('canplay', () => {
			console.log('video canplay')
		});
		document.getElementById(this.audioId).addEventListener('play', () => {
			console.log('video play')
		})
		document.getElementById(this.audioId).addEventListener('pause', () => {
			console.log('video pause');
		})
	},
	methods: {
		
	}
}
</script>

<style scoped lang="less">
.audio{
	width: 100%;
	height: 100%;
	position: relative;
	background: url("../assets/images/avatar.png") no-repeat;
	background-size: 40%;
	background-position: center center;
	&.filter{
		filter: blur(4px);
	}
	.audio-element{
		width: 100%;
		height: 100%;
	}
}
</style>
