<template>
	<!-- <div class="loading-avatar" :class="{filter: isFilter}"> -->
	<div class="loading-avatar" :class="{filter: isFilter}">
	</div>
</template>

<script>
export default {
	props: ['isShowFilter'],
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
		}
	},
	mounted() {
		console.log('mounted:::');
	},
	methods: {
		
	}
}
</script>

<style scoped lang="less">
.loading-avatar{
	width: 100%;
	height: 100%;
	background: url("../assets/images/avatar.png") no-repeat;
	background-size: 40%;
	background-position: center;
	position: absolute;
	top: 0;
	left: 0;
	&.filter{
		filter: blur(4px);
	}
}
</style>
