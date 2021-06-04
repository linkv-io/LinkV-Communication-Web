<template>
  <div id="live">
    <div class="right">
      <div class="content">
        <div v-for="item in list" :key="item.key" class="content-item">
          <div class="content-item-user">{{ item.from }}</div>
          <div class="content-item-content">{{ item.content }}</div>
        </div>
      </div>

      <div class="footer">
        <input
          type="text"
          v-model="message"
          @keydown.enter="onEnterSendMessage"
        />
        <div @click="onSend">send</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  props: ["rim", "roomId", "userId", "list"],
  methods: {
    onEnterSendMessage() {
      this.onSend();
    },

    onSend() {
      let self = this;
      if (this.rim && this.message) {
        this.rim.liveroomManager.sendMessage(this.roomId, this.message).then(
          () => {
            const list = this.list;
            if (list.length > 10) {
              list.pop();
            }
            list.push({ from: self.userId, content: this.message });
            this.message = "";
          },
          (err) => {
            this.$message.error("消息发送失败");
            console.log(err);
          }
        );
      }
    },
  },
};
</script>
<style lang="less">
#live {
  width: 446px;
  z-index: 500;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .right {
    width: 446px;
    .content {
      padding: 0px;
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      box-sizing: border-box;
      height: 411px;
      border-radius: 4px;
      overflow-y: auto;
      .content-item {
        display: flex;
        justify-content: flex-start;
        margin: 10px 10px 0 19px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        // color: #666666;
        line-height: 20px;
        .content-item-user {
          color: #3674ff;
        }
        .content-item-content {
          color: #ddd;
          margin-left: 4px;
        }
      }
    }
    .footer {
      margin: 5px 0 0 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        background: rgba(0, 0, 0, 0.4);
        font-size: 20px;
        color: #fff;
        display: block;
        width: 334px;
        height: 60px;
        padding: 0 15px;
        box-sizing: border-box;
        outline: none;
        border: none;
        border-radius: 30px;
        font-size: 14px;
        font-weight: 400;
        // color: #aeb0b8;
        line-height: 20px;
      }
      div {
        background: rgba(0, 0, 0, 0.4);
        display: block;
        width: 90px;
        height: 60px;
        box-sizing: border-box;
        border: #ddd;
        color: #fff;
        font-size: 14px;
        border-radius: 30px;
        background-size: 20px 20px;
        background-position: 5px 10px;
        cursor: pointer;
        text-align: center;
        line-height: 60px;
      }
    }
  }
}
</style>