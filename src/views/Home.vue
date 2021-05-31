<template>
  <div class="home" id="login">
    <Nav />
    <div class="wrap">
      <div class="content">
        <div class="content-logo">
          <img src="../assets/touxiang.jpg" alt="" />
        </div>
        <div class="content-name">花无缺</div>
        <div class="content-id">ID:{{ selfUserId }}</div>
        <div class="btns-list">
          <input
            type="text"
            :class="{ 'content-input': true }"
            v-model="userId"
          />
          <button :class="{ btn: true, 'active-btn': userId }" @click="call">
            呼叫
          </button>
        </div>
      </div>
    </div>
    <!-- 弹出框 接收-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="460px"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-content">
        <div class="dialog-content-img">
          <img src="../assets/touxiang.jpg" />
        </div>
        <div class="dialog-content-name">
          <div class="dialog-content-name-title">小鱼儿</div>
          <div class="dialog-content-name-content">申请和你视频通话</div>
        </div>
        <div class="dialog-content-icon">
          <div class="dialog-content-icon-receive">
            <img src="../assets/anwser@3x.png" @click="receive" />
          </div>
          <div class="dialog-content-icon-refuse">
            <img src="../assets/reject@3x.png" @click="refuse" />
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出框 发送包括挂断-->
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="460px"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    </el-dialog> -->
    <Settings
      v-bind:isShowSet.sync="isShowSet"
      v-on:get-settings="getSettings"
      v-bind:source="'home'"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import config from "../config";
import { getSelfUserId } from "../utils/util";
import Settings from "@/components/settings.vue";
import Nav from "@/components/navigate.vue";

let { environment, appId, appKey, token } = config;

export default {
  name: "Home",
  data() {
    return {
      userId: "",
      dialogVisible: false,
      selfUserId: getSelfUserId(),
      personalManager: "",
      handleObj: {
        linkv_video_call: this.videoCallHandle,
        linkv_anwser_call: this.anwserCallHandle,
        linkv_hangup_call: this.hangupCallHandle,
      },
      isAudio: null,
      accept: null,
      isShowSet: false,
    };
  },
  components: {
    Nav,
    Settings,
  },
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
    getSettings(res) {
      this.$store.commit("updateEnv", res.env);
      this.$store.commit("setResultSettingConfig", res);
    },
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
      const self = this;
      if (im && this.selfUserId && this.userId) {
        if (creatRoom) {
          im.liveroomManager
            .create(String(this.selfUserId))
            .then(() => {
              this.$message.success("创建IM房间成功");
              self.joinRtcRoom(true);
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
                self.joinRtcRoom(false);
              }, 7000);
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
      this.dialogVisible = true;
      this.userId = from;
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
        this.$message({
          type: "error",
          message: "对方拒绝了您的视频",
          showClose: true,
          duration: 5000,
          offset: 200,
        });
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
            $data: { content, extend1, from },
          } = value;
          content = JSON.parse(content);
          self.handleObj[extend1](content, from);
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
            this.$message.error("发送呼叫消息失败,请重新呼叫");
          });
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
    receive() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        this.dialogVisible = false;
        this.receiveAndRefuse(true);
      }
    },
    refuse() {
      this.dialogVisible = false;
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
            if (accept) {
              this.joinIMRoom({ creatRoom: true });
            }
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
@import url("../assets/css/common.less");
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .wrap {
    width: 100%;
    height: 100%;
    position: relative;
    margin-top: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
      180deg,
      rgba(0, 23, 55, 1) 0%,
      rgba(24, 55, 136, 0.58) 100%
    );
    display: flex;
    padding-bottom: 80px;
    box-sizing: border-box;
    .settings {
      top: 38%;
    }
    .content {
      width: 510px;
      background: rgba(255, 255, 255, 1);
      border-radius: 6px;
      position: relative;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      .set {
        width: 38px;
        height: 38px;
        background: url("../assets/images/set.png") no-repeat;
        background-size: cover;
        display: block;
        position: absolute;
        right: 15px;
        top: 15px;
      }
      .content-logo {
        width: 170px;
        height: 170px;
        // background: url("../assets/icon_bg@2x.png") no-repeat;
        background-size: contain;
        border-radius: 50%;
        margin: 80px auto 0 auto;
        background-position: center;
        img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }
      }
      .content-name {
        font-size: 30px;
        font-weight: 900;
        text-shadow: 2px 2px 2px grey;
      }
      .content-id {
        font-size: 20px;
      }

      .btns-list {
        width: 100%;
        height: 300px;
        padding: 0 38px;
        box-sizing: border-box;
        margin: 80px 0;
        .content-input {
          border-bottom: 1px solid #ddd;
          font-size: 30px;
          height: 50px;
          width: 90%;
          text-align: center;
          outline: none;
        }
        .btn {
          width: 90%;
          height: 70px;
          background: url("../assets/btn_bg_normal@2x.png") no-repeat;
          background-size: 100% 70px;
          border-radius: 4px;
          margin: 36px auto 0 auto;
          font-size: 20px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 28px;
          letter-spacing: 1px;
          outline: none;
          padding: 0px;
          border: none;
        }
        .active-btn {
          background: url("../assets/btn_bg_selected@2x.png") no-repeat;
          background-size: 100% 70px;
        }
      }
      .version {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
      }
    }
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 20px;
  }
  .dialog-content {
    display: flex;
    .dialog-content-img {
      margin-right: 20px;
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .dialog-content-name {
      margin-top: 10px;
      .dialog-content-name-title {
        font-size: 30px;
        font-weight: 900;
        text-shadow: 2px 2px 2px grey;
      }
      .dialog-content-name-content {
        font-size: 20px;
      }
    }
    .dialog-content-icon {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .dialog-content-icon-receive {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        img {
          cursor: pointer;
          width: 100%;
          height: 100%;
          transform: rotate(-135deg);
        }
      }
      .dialog-content-icon-refuse {
        width: 50px;
        height: 50px;
        img {
          cursor: pointer;
          width: 100%;
          height: 100%;
          transform: rotate(135deg);
        }
      }
    }
  }
}
@media screen and (max-height: 900px) {
  .home {
    .wrap {
      .content {
        width: 450px;
        height: 500px;
        .content-logo {
          margin-top: 50px;
        }
        .btn1 {
          margin-top: 68px !important;
        }
      }
    }
  }
}

@import "../assets/css/mobile/home.less";
</style>
