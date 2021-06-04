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
          <button
            :class="{ btn: true, 'active-btn': userId && isLogin }"
            @click="call"
          >
            呼叫
          </button>
        </div>
      </div>
    </div>
    <!-- 弹出框 接收-->
    <el-dialog
      :visible.sync="dialogVisible"
      :width="isCall ? '440px' : '460px'"
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
          <div class="dialog-content-name-title" v-show="isCall">花无缺</div>
          <div class="dialog-content-name-content" v-show="isCall">
            邀请小鱼儿视频通话
          </div>
          <div class="dialog-content-name-title" v-show="!isCall">小鱼儿</div>
          <div class="dialog-content-name-content" v-show="!isCall">
            申请和你视频通话
          </div>
        </div>
        <div class="dialog-content-icon">
          <audio ref="audio" loop="loop">
            <source src="../assets/voip_call.mp3" type="audio/mp3" />
          </audio>
          <div class="dialog-content-icon-receive" v-show="!isCall">
            <img src="../assets/anwser@3x.png" @click="receive" />
          </div>
          <div class="dialog-content-icon-refuse">
            <img src="../assets/reject@3x.png" @click="refuse" />
          </div>
        </div>
      </div>
    </el-dialog>
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
let { environment, imAppId, rtcAppId, appKey, token } = config;
// let { environment, token } = config;

let selfUserId = String(getSelfUserId());
export default {
  name: "Home",
  data() {
    return {
      rim: null,
      im: null,
      isCall: true,
      userId: "",
      rtcUserId: "",
      dialogVisible: false,
      selfUserId,
      personalManager: "",
      liveroomManager: "",
      handleObj: {
        linkv_video_call: this.videoHandle,
        linkv_anwser_call: this.anwserHandle,
        linkv_hangup_call: this.hangupHandle,
      },
      isAudio: null,
      accept: null,
      isShowSet: false,
      isLogin: false,
    };
  },
  created() {
    this.getToken();
  },
  components: {
    Nav,
    Settings,
  },
  mounted() {
    this.isLoading = this.$loading.service({
      fullscreen: true,
      text: "登录中",
      background: "rgba(255, 255, 255, 0.3)",
    });
    this.init();
    this.login();
  },
  methods: {
    async getToken() {
      try {
        // eslint-disable-next-line no-unused-vars
        const result = await fetch(
          `https://catchu-im-api.fusionv.com/api/rest/getWebimToken`,
          {
            Headers: JSON.stringify({
              appid: "9K0YmleBXINt8BG92obtow==",
              appKey: "7VVuST4bp1dNe8MxZgFciw==",
              userid: this.userId,
            }),
            method: "POST",
          }
        );
        console.log(result);
      } catch (error) {
        console.log("+++tokenerrr+++", error);
        this.$message.error("get token error");
      }
    },
    getSettings(res) {
      this.$store.commit("updateEnv", res.env);
      this.$store.commit("setResultSettingConfig", res);
    },
    init() {
      // this.rim = new window.RIM({
      //   appId:
      //     "3AA052D3C91F66A94AE5FC4BDBE39A398274C5AF2410F5C3DB86E0FBA61DBF915915297CDCB1392B29DCE8A81987F9B8EBA6E877E3551BDF36691E627F132EA95BF998E3E616E2177A1F6C2B28FB6BE8E7071C2F5701F59DFA9EB2F0866C6FFF1FD46F26311D396AFC302B89B6B6E5ABB433E9112B2B902786936AEF8A8B5DA2DEC5906BF9CA6655908CDC26829C1A6FFEA46150EAA763CB63519343A01BDD7A71CA537154662AC88FDB19A0BE70C2629A6CEA4FFFD93D77D8434C098D8F4AB89D879686F00D8EC8EA1E033C3EBFB7E4259F37351965142F58DA1506B1230C4F3F50EC2D9E66A06D361F5A767804F35E6DF3D086E078CB7348A5F267552BA4473182F79BC072C92A84950259C86BD699FC6E86999816641446D516AF983D2670A3AF75ECFC1F743B720605A412021133E5CCE3DC5FE44959C60A7656029F51774CD177A46C2974F388741A948AE99780652CD3D58017F132A2C37ACB38CDFEA5543C961A0A6DF7D16C6745D3062AC0E0FBEA8470CBC9E137A8400B7D23A0C2737A32D14634223C2C7CFE4867752DDB346C271C23D82E92264AFA33B7170EFA0DC1648942F7A8937C3B0AF9BACAD9BB16",
      //   appKey: "YpqpJT2NG9zIrkI1N9SiAgXuA2xd8RMj",
      //   environment,
      //   userId: this.selfUserId,
      //   socketUrl: "wss://webimv2.fusionv.com/",
      // });
      this.rim = new window.RIM({
        // appId:'YpqpJT2NG9zIrkI1N9SiAgXuA2xd8RMj',
        imAppId,
        rtcAppId,
        appKey,
        environment,
        userId: this.selfUserId,
        // socketUrl: "wss://webimv2.fusionv.com/",
        socketUrl:'10.61.153.49:10002'
      });
    },
    async login() {
      try {
        await this.rim.login(this.selfUserId, token);
        this.$message.success("登录成功");
        this.isLoading.close();
        this.isLogin = true;
        const { _personalManager, _liveroomManager } = this.rim;
        this.personalManager = _personalManager;
        this.liveroomManager = _liveroomManager;
        this.onEvent();
      } catch (error) {
        this.isLoading.close();
        this.$message.error("登录失败请重新登录");
        console.log("登录失败", error);
      }
    },
    // 加入 im直播间
    async joinRoom(value) {
      const { creatRoom } = value;
      const self = this;
      if (creatRoom) {
        this.roomId = this.selfUserId;
        this.rtcUserId = "H" + this.selfUserId;
      } else {
        this.roomId = this.userId;
        this.rtcUserId = this.selfUserId;
      }
      try {
        let streamListTemp = await this.rim.joinRoom(
          this.rtcUserId,
          this.roomId,
          creatRoom ? 1 : 2,
          token,
          "",
          ""
        );
        if (creatRoom) {
          let content = { isAudio: false, extra: "", accept: true };
          let type = "linkv_anwser_call";
          await this.sendEventMessage(content, type);
        }
        this.$refs.audio.pause();
        this.goMeet(creatRoom, streamListTemp, self.rim);
      } catch (error) {
        console.log(error);
        this.$message.error("加入房间失败");
      }
    },
    goMeet(value, streamListTemp, rim) {
      this.$router.push({
        name: "Meet",
        params: {
          source: value ? 1 : 2,
          roomId: value ? this.selfUserId : this.userId,
          userId: this.rtcUserId,
          streamListTemp,
          rim,
        },
      });
    },
    sendEventMessage(content, type) {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        content = JSON.stringify(content);
        return personalManager.sendEventMessage(userId, content, type);
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },

    // 函数
    async call() {
        this.isCall = true;
        let content = { isAudio: false, extra: "" };
        let type = "linkv_video_call";
        try {
          const self = this;
          await this.sendEventMessage(content, type);
          this.dialogVisible = true;
          setTimeout(() => {
            self.$refs.audio.play();
          });
        } catch (error) {
          console.log("发送呼叫消息失败", error);
          this.$message.error("发送呼叫消息失败,请重新呼叫");
        }
    },
    // 接收
    receive() {
      const { personalManager, userId } = this;
      if (personalManager && userId) {
        this.dialogVisible = false;
        this.receiveAndRefuse(true);
      }
    },
    // 拒绝
    refuse() {
      this.$refs.audio.pause();
      if (this.isCall) {
        this.hangUp();
      } else {
        this.receiveAndRefuse(false);
      }
    },
    //主动挂断
    async hangUp() {
      const { userId } = this;
      if (userId) {
        let content = { extra: "" };
        let type = "linkv_hangup_call";
        try {
          await this.sendEventMessage(content, type);
          this.dialogVisible = false;
        } catch (error) {
          console.log("发送主动挂断消息失败", error);
          this.$message.error("发送主动挂断消息失败");
        }
      } else {
        this.$message.error("请选择需要发送的用户");
      }
    },
    // 同意或拒绝呼叫
    async receiveAndRefuse(accept) {
      if (accept) {
        this.joinRoom({ creatRoom: true });
      } else {
        this.dialogVisible = false;
        let accept = false;
        let content = { isAudio: false, extra: "", accept: accept };
        let type = "linkv_anwser_call";
        try {
          await this.sendEventMessage(content, type);
        } catch (error) {
          this.$message.error("挂断消息失败");
        }
      }
    },
    videoHandle(content, from) {
      const { isAudio } = content;
      this.isAudio = isAudio;
      this.isCall = false;
      this.dialogVisible = true;
      const self = this;
      setTimeout(() => {
        self.$refs.audio.play();
      }, 500);
      this.userId = from;
    },
    anwserHandle(content) {
      const { isAudio, accept } = content;
      this.isAudio = isAudio;
      this.accept = accept;
      this.$message.success("接收到同意或拒绝呼叫");
      // 如果是同意
      const self = this;
      if (accept) {
        setTimeout(() => {
          self.joinRoom({ createRoom: false });
        }, 5000);
      } else {
        this.$refs.audio.pause();
        this.dialogVisible = false;
        this.$message({
          type: "error",
          message: "对方拒绝了您的视频",
          showClose: true,
          duration: 5000,
          offset: 200,
        });
      }
    },
    // 主动挂断
    hangupHandle() {
      this.$message.error("对端主动挂断了电话");
      this.$refs.audio.pause();
      this.dialogVisible = false;
    },
    onEvent() {
      let { personalManager, liveroomManager } = this;
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
      if (liveroomManager) {
        liveroomManager.on("message", (value) => {
          console.log(value);
        });
      }
    },
  },
  destroyed() {
    console.log("destroyed");
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
    justify-content: space-between;
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
