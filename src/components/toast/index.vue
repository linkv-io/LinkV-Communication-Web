<template>
    <div class="toast">
        {{content}}
    </div>
</template>

<script>
export default {
    name: 'Toast',
    // props: ['content', 'duration'],
    data() {
        return {
            content: '',
            duration: 2000
        };
    },
    mounted() {
        console.log('toast params:::', this.content, this.duration);
        setTimeout(() => {
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        }, this.duration);
    }
}
</script>

<style lang="less" scoped>
.toast{
    width: 300px;
    height: auto;
    line-height: 30px;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    position: absolute;
    bottom: 185px;
    left: 50%;
    margin-left: -150px;
    z-index: 2;
    background: rgba(37,41,46,0.80);
    border-radius: 6px;
    font-size: 18px;
    color: #FFFFFF;
}
</style>