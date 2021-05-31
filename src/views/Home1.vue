<template>
  <div class="login" id="login">
    <!-- <Nav /> -->
    <div class="wrap"></div>
    <div class="content">
      <el-button>selfUserId:{{ selfUserId }}</el-button>
      <el-button @click="call">call</el-button>
      <el-button @click="hangUp">hangup</el-button>
      <el-button @click="receive">receive</el-button>
      <el-button @click="refuse">Refuse</el-button>
      <el-button @click="sendRoom">发送直播间消息</el-button>
      <el-input
        type="text"
        v-model="userId"
        placeholder="请输入呼叫的用户 id"
      />
    </div>

    <!-- <img src="../assets/logo_ico@2x.png" alt="" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import config from "../config";
import { getSelfUserId } from "../utils/util";
// import Nav from "@/components/navigate.vue";

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
      handleObj: {
        linkv_video_call: this.videoCallHandle,
        linkv_anwser_call: this.anwserCallHandle,
        linkv_hangup_call: this.hangupCallHandle,
      },
      isAudio: null,
      accept: null,
    };
  },
  // components: {
  //   Nav,
  // },
  mounted() {
    let { WebIM } = window.webim;
    window.im = new WebIM({
      environment,
      appId,
      appKey,
    });
    window.im
      .login(String(this.selfUserId), token)
      .then((data) => {
        console.log(data);
        this.$message.success("登录成功");
      })
      .catch((err) => {
        console.log(err, "err");
        console.log(err.message);
        this.$message.error("登录失败请重新登录");
      });
    this.personalManager = window.im.personalManager;
    this.onEvent();
  },
  methods: {
    sendRoom() {
      this.message = "linkv_enable_mic";
      window.im.liveroomManager
        .sendMessage(String(this.selfUserId), this.message)
        .then(
          (data) => {
            this.message = "";
            // this.$message.success("消息发送成功");
            console.log(data);
          },
          (err) => {
            this.$message.success("消息发送失败");
            console.log(err);
          }
        );
    },
    joinIMRoom(value) {
      const { creatRoom } = value;
      const { im } = window;
      // const self = this;
      if (im && this.selfUserId && this.userId) {
        if (creatRoom) {
          im.liveroomManager
            .create(String(this.selfUserId))
            .then(() => {
              this.$message.success("创建IM房间成功");
              // self.joinRtcRoom(true);
            })
            .catch((err) => {
              console.log(err, "创建直播间失败");
              this.$message.error("创建直播间失败,请重新创建");
            });
        } else {
          im.liveroomManager
            .join(String(this.userId))
            .then(() => {
              setTimeout(() => {
                // self.joinRtcRoom(false);
              }, 4000);
              this.$message.success("加入直播间成功");
            })
            .catch((err) => {
              console.log(err, "加入直播间失败");
              this.$message.error("加入直播间失败,请重新加入");
            });
        }
      }
    },
    joinRtcRoom(value) {
      this.$router.push({
        name: "Meet",
        params: {
          source: value ? 1 : 2,
          roomId: value ? this.selfUserId : this.userId,
          userId: this.selfUserId,
        },
      });
    },
    videoCallHandle(content, from) {
      const { isAudio } = content;
      this.isAudio = isAudio;
      this.$message.success("接收到 call 消息");
      this.userId = from;
      //
    },
    anwserCallHandle(content) {
      const { isAudio, accept } = content;
      this.isAudio = isAudio;
      this.accept = accept;
      this.$message.success("接收到同意或拒绝呼叫");
      // 如果是同意
      if (accept) {
        this.joinIMRoom({ createRoom: false });
      } else {
        this.$message.success("对方拒绝了你的邀请");
      }
    },
    hangupCallHandle() {
      this.$message.success("接收到主动挂断的消息");
    },
    onEvent() {
      let { personalManager } = this;
      let self = this;
      if (personalManager) {
        personalManager.on("message", (value) => {
          let {
            // eslint-disable-next-line no-unused-vars
            $data: { content, extend1, from },
          } = value;
          content = JSON.parse(content);

          self.handleObj[extend1](content, from);
          // this.$message.success("接收私聊消息成功");
          console.log(value);
        });
      }
      const liveroomManager = window.im;
      liveroomManager.on("message", (value) => {
        console.log(value);
      });
    },
    // 函数
    call() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        let msg = { isAudio: false, extra: "" };
        let content = JSON.stringify(msg);
        let type = "linkv_video_call";
        personalManager
          .sendEventMessage(String(userId), content, type)
          .then((res) => {
            console.log(res);
            this.$message.success("发送呼叫消息成功");
          })
          .catch((err) => {
            console.log("发送呼叫消息失败", err);
            this.$message.error("发送呼叫消息失败");
          });
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
    receive() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        this.receiveAndRefuse(true);
      }
    },
    refuse() {
      this.receiveAndRefuse(false);
    },
    //主动挂断
    hangUp() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        let msg = { extra: "" };
        let content = JSON.stringify(msg);
        let type = "linkv_hangup_call";
        personalManager
          .sendEventMessage(String(userId), content, type)
          .then((res) => {
            console.log(res);
            this.$message.success("发送主动挂断消息成功");
          })
          .catch((err) => {
            console.log("发送主动挂断消息失败", err);
            this.$message.error("发送主动挂断消息失败");
          });
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
    // 同意或拒绝呼叫
    receiveAndRefuse(accept) {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        let msg = { isAudio: false, extra: "", accept };
        let content = JSON.stringify(msg);
        let type = "linkv_anwser_call";
        personalManager
          .sendEventMessage(String(userId), content, type)
          .then((res) => {
            console.log(res);
            console.log("发送同意或拒绝消息成功");
            this.joinIMRoom({ creatRoom: true });
          })
          .catch((err) => {
            console.log("发送同意或拒绝消息失败", err);
            this.$message.error("发送同意或拒绝消息失败");
          });
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
  },
};
</script>

<style lang="less">
.login {
  .content {
    margin-top: 200px;
  }
  .el-button {
    font-size: 20px;
  }
}
</style>
