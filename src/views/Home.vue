<template>
  <div class="login" id="login">
    <el-button>selfUserId:{{ selfUserId }}</el-button>
    <el-button @click="handleCall">call</el-button>
    <el-button @click="handleCall">receive</el-button>
    <el-button @click="handleCall">Refuse</el-button>
    <el-input type="text" v-model="userId" placeholder="请输入呼叫的用户 id" />
    <!-- <img src="../assets/logo_ico@2x.png" alt="" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import config from "../config";
import { getSelfUserId } from "../util/util";

let { environment, appId, appKey, token } = config;

export default {
  name: "Home",
  data() {
    return {
      id: "",
      isLoading: false,
      userId: "",
      selfUserId: getSelfUserId(),
      personalManager: "",
    };
  },
  mounted() {
    let { WebIM } = window.webim;
    if (!window.im) {
      window.im = new WebIM({
        environment,
        appId,
        appKey,
      });
      window.im.login(this.selfUserId, token).then(
        () => {},
        () => {
          this.$message.error("登录失败请重新登录");
        }
      );
      this.personalManager = window.im.personalManager;
      this.onEvent();
    }
  },
  methods: {
    onEvent() {
      let { personalManager } = this;
      if (personalManager) {
        // eslint-disable-next-line no-unused-vars
        personalManager.on("message", (value) => {
          this.$message.success("接收私聊消息成功");
        });
      }
    },
    handleCall() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        let msg = { isAudio: false, extra: "" };
        let content = JSON.stringify(msg);
        let type = "linkv_video_call";
        personalManager.sendEventMessage(userId, content, type).then(
          (res) => {
            console.log(res);
            // this.$message.success("消息发送成功");
            this.messageList.push({
              content: this.chatMessage,
              from: this.selfUserId,
            });
            this.chatMessage = "";
          },
          (err) => {
            console.log("私信消息发送失败", err);
            this.$message.error("私信消息发送失败");
          }
        );
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
  },
};
</script>

<style lang="less">
.login {
  margin-top: 200px;
  .el-button {
    font-size: 20px;
  }
}
</style>
