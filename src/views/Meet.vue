<template>
  <div class="meet">
    <Nav
      v-bind:isShowContent="true"
      v-bind:roomId.sync="roomId"
      v-bind:userId.sync="userId"
    />
    <div class="content">
      <div class="cover-video" :class="{ loading: streamList.length == 0 }">
        <Audio
          v-bind:audioId="streamList[0].userId"
          v-bind:videoMuted="source == 1"
          v-bind:isShowFilter.sync="streamList.length == 0"
          v-bind:stream.sync="streamList[0].stream"
          v-if="streamList.length != 0 && scene == 'audio'"
        />
        <Video
          v-on:get-video-status="getVideoStatus"
          v-bind:videoId="streamList[0].userId"
          v-bind:videoMuted="source == 1"
          v-bind:stream.sync="streamList[0].stream"
          v-if="streamList.length != 0 && scene != 'audio'"
        />
      </div>
      <div
        class="rignt-fixed"
        :class="{ active: this.rightStreamList.length != 0 && isShowRightList }"
      >
        <ul class="list">
          <li class="cell" v-for="item in rightStreamList" :key="item.userId">
            <Audio
              v-bind:audioId="item.userId"
              v-bind:videoMuted="isShowJoin && item.userId == userId"
              v-bind:stream.sync="item.stream"
              v-if="scene == 'audio'"
            />
            <Video
              v-else
              v-on:get-video-status="getVideoStatus"
              v-bind:videoMuted="isShowJoin && item.userId == userId"
              v-bind:videoId="item.userId"
              v-bind:stream.sync="item.stream"
            />
          </li>
        </ul>
      </div>
    </div>
    <div
      class="right-button-fixed"
      :class="{
        'btn-active': this.rightStreamList.length != 0 && isShowRightList,
      }"
      @click="foldFun"
    >
      <i
        class="triangle"
        :class="{
          'triangle-active':
            this.rightStreamList.length != 0 && isShowRightList,
        }"
      ></i>
    </div>
    <ul class="tool">
      <li
        class="item share"
        :class="{ active: isActiveShare }"
        @click="display"
        v-if="false"
      ></li>
      <li
        class="item share"
        :class="{ active: isActiveShare }"
        @click="live"
      ></li>
      <li
        class="item mute"
        :class="{ active: isActiveMute }"
        @click="mute"
        v-if="source == 1 || (source == 2 && isShowJoin)"
      ></li>
      <!-- <li
        class="item join"
        :class="{ active: isShowJoin }"
        @click="join"
        v-if="source == 2"
      ></li> -->
      <li
        class="item record"
        :class="{ active: isActiveCamera }"
        @click="record"
        v-if="isShowRecord"
      ></li>
      <!-- <li class="item set" @click="set" v-if="source != 3"></li> -->
      <li class="item close" @click="close"></li>
    </ul>
    <Settings
      v-bind:isShowSet.sync="isShowSet"
      v-bind:isSettingShowVideoDeviceOptions.sync="isSettingShowVideoDevice"
      v-bind:deviceConfigObj="deviceConfigObj"
      v-bind:source="'meet'"
      v-on:get-settings="getSettings"
    />
    <Live
      v-if="isShowLive"
      :rim="lvcEngine"
      :roomId="roomId"
      :userId="userId"
      :list="list"
    />
  </div>
</template>

<script>
import Nav from "@/components/navigate.vue";
import Video from "@/components/video.vue";
import Audio from "@/components/audio.vue";
import Settings from "@/components/settings.vue";
import Live from "@/components/live.vue";
import * as bowser from "bowser";
import config from "@/config/octopus.config.js";
import { mapState } from "vuex";

export default {
  name: "Meet",
  components: {
    Nav,
    Video,
    Audio,
    Settings,
    Live,
  },
  data() {
    return {
      list: [],
      lvcEngine: null,
      isShowLive: false,
      userId: "",
      source: 0,
      roomId: "",
      streamList: [],
      currentConfig: {},
      videoMuted: false,
      isShowRightList: true,
      isShowJoin: true,
      isShowSet: false,
      isActiveMute: false,
      isActiveCamera: false,
      isActiveShare: false,
      resolutionObj: ["low", "middle", "hight"],
      deviceConfigObj: {
        audioDevices: [],
        videoDevices: [],
      },
      streamPause: false,
      videoStatus: true,
      direction: "push",
      logLevel: 0,
      enableLogUpload: true,
      playStatsTimer: {},
      publishStatsTimer: {},
    };
  },
  computed: {
    isSettingShowVideoDevice() {
      const res =
        (this.source == 1 || (this.source == 2 && this.isShowJoin)) &&
        this.scene == "video";
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.deviceConfigObj.videoDevicesShow = res;
      return res;
    },
    rightStreamList() {
      return this.streamList.slice(1);
    },
    isShowRecord() {
      if (this.scene == "audio") {
        return false;
      } else {
        return (this.source == 2 && this.isShowJoin) || this.source == 1;
      }
    },
    ...mapState(["resultSettingConfig", "scene"]),
  },
  watch: {
    isSettingShowVideoDevice(n) {
      if (n) {
        this.$store.commit("updateScene", "video");
      }
    },
  },
  async mounted() {
    console.log(
      "get init params:::",
      this.$route.params,
      this.resultSettingConfig,
      this.scene
    );
    this.pageInit();
  },
  methods: {
    getVideoStatus(status) {
      this.videoStatus = status;
    },

    async pageInit() {
      const routerParams = this.$route.params;
      // eslint-disable-next-line no-unused-vars
      if (routerParams.source == void 0) {
        this.$router.push({ name: "Home" });
        return;
      } else {
        const {
          roomId,
          userId,
          streamListTemp,
          lvcEngine,
          source,
          peerUserId,
        } = routerParams;
        this.lvcEngine = lvcEngine;
        this.octopusRTC = this.lvcEngine._octopusRTC;
        this.roomId = roomId;
        this.userId = userId;
        this.peerUserId = peerUserId;
        this.source = source; // 1为推流 2为拉流
        let env = "prod";
        this.handleCallbackFun();
        this.onEvent();
        if (this.source == 1 || this.source == 2) {
          this.currentConfig = {
            ...this.resultSettingConfig,
            ...config[env],
          };
        }
        switch (parseInt(this.source)) {
          case 1:
            this.direction = "push";
            console.log("publish::", this.roomId, this.userId);
            break;
          case 2:
            this.direction = "pull";
            break;
        }
        this.streamList = streamListTemp;
        console.log("loginSuccess:::", this.streamList);
        this.createVideoElement();
      }
    },
    createVideoElement() {
      this.streamList.push({
        userId: this.userId,
        streamId: this.userId,
        roomId: this.roomId,
      });
      this.$nextTick(() => {
        this.creatPublishStream();
      });
      this.getPullStreamList();
    },
    async getPullStreamList() {
      for (let [index, item] of this.streamList.entries()) {
        console.log(item.userId);
        if (item.userId != this.userId) {
          const stream = await this.palyStream(item.userId);
          if (stream?.code == 0) {
            this.$toast({ content: `${item.userId} play failed.` });
          }
          console.log("pull play stream:::", stream);
          this.$set(item, "stream", stream);
          this.$set(this.streamList, index, item);
        }
      }
    },
    async creatPublishStream() {
      this.previewResult = await this.startPreview({
        camera: {
          audio: true,
          audioInput: this.currentConfig.audioDevices,
          video: this.scene == "audio" ? false : true,
          videoInput: this.currentConfig.videoDevices,
          videoQuality: this.currentConfig.resolution,
          bitRate: this.currentConfig.bitRate,
          width: this.currentConfig.width,
          height: this.currentConfig.height,
          frameRate: this.currentConfig.frameRate,
          sampleRate: this.currentConfig.sampleRate,
          channelCount: this.currentConfig.channelCount,
          audioBitrate: this.currentConfig.audioBitrate,
        },
      });

      this.streamList.forEach((value, key) => {
        if (value.userId == this.userId) {
          this.$set(this.streamList, key, {
            ...value,
            stream: this.previewResult,
          });
        }
      });
      console.log(
        "startPreview stream0000:::",
        this.previewResult,
        this.streamList
      );
      const browser = bowser.getParser(window.navigator.userAgent);
      console.log("browser info:::", browser);
      if (browser.satisfies({ safari: "<=12.0" })) {
        document.getElementById(this.userId).play();
      }
      this.publishStream(this.previewResult);
    },
    palyStream(userId) {
      return this.lvcEngine.startPlayingStream(userId);
    },
    publishStream(stream) {
      this.lvcEngine.startPublishingStream(this.userId, stream);
    },
    stopPublishStream() {
      for (let item of this.streamList) {
        if (item.userId == this.userId) {
          this.lvcEngine.destroyStream(item.stream);
        }
      }
      this.lvcEngine.stopPublishingStream(this.userId);
      clearInterval(this.publishStatsTimer[this.userId]);
    },
    async startPreview(params) {
      return await this.lvcEngine.createStream(params);
    },
    onEvent() {
      const { liveroomManager } = this.lvcEngine;
      const list = this.list;
      // 直播间消息
      liveroomManager.on("message", (value) => {
        console.log(value, "直播间消息");
        this.isShowLive = true;
        if (list.length > 10) {
          list.shift();
          console.log(list);
          list.push(value);
        } else {
          list.push(value);
        }
      });
      // 用户加入
      liveroomManager.on("join", (value) => {
        this.$message.success(`用户${value.userId}加入直播间`);
      });
      // 用户离开
      liveroomManager.on("leave", (value) => {
        this.$message.warning(`用户${value.userId}离开直播间`);
      });
      // 创建
      liveroomManager.on("create", (value) => {
        this.$message.warning(`用户${value.userId}创建的直播间`);
      });
    },
    sendEventMessage(content, type) {
      const { peerUserId } = this;
      const { personalManager } = this.lvcEngine;
      if (personalManager && peerUserId) {
        content = JSON.stringify(content);
        return personalManager.sendEventMessage(peerUserId, content, type);
      } else {
        this.$message.error("请选择要发送的用户");
      }
    },
    handleCallbackFun() {
      this.octopusRTC.on("disconnect", async (err) => {
        console.log("handleDisconnect:::", err);
        this.$toast({ content: this.$t("m.connectionError") });
        this.close();
      });
      // add by version 2.0.0
      const playCallback = ({ code, streamId, state }) => {
        console.log(
          "event emit play-state-update:::",
          code,
          streamId,
          state,
          this.streamList
        );
        if (this.playStatsTimer[streamId]) {
          clearInterval(this.playStatsTimer[streamId]);
        }
        const type = code;
        this.streamList.forEach(async (value, key) => {
          if (value.streamId == streamId) {
            if (type == 1 || type == 11) {
              this.$set(this.streamList, key, value);
            } else if (type == 0) {
              this.$toast({ content: `${streamId}拉流失败。` });
            }
            console.log("onPlayStateUpdate:::", this.streamList);
          }
        });
        this.playStatsTimer[streamId] = setInterval(async () => {
          // const audioResult = await this.octopusRTC.getRemoteAudioStats(
          //   streamId
          // );
          // const videoResult = await this.octopusRTC.getRemoteVideoStats(
          //   streamId
          // );
          // console.log("play stats result:::", audioResult, videoResult);
        }, 2000);
      };
      this.octopusRTC.on("play-state-update", playCallback);

      // add by version2.0.0
      this.octopusRTC.on(
        "publish-state-update",
        async ({ code, streamId, state }) => {
          console.log("event emit publisherStateUpdate", code, state);
          if (this.publishStatsTimer[streamId]) {
            clearInterval(this.publishStatsTimer[streamId]);
          }
          const type = code;
          if (type == 0) {
            this.$toast({ content: `${streamId}推流失败。` });
          } else if (type == 1) {
            if (this.source == 1) {
              console.log("推流成功");
              let content = { isAudio: false, extra: "", accept: true };
              let type = "linkv_anwser_call";
              await this.sendEventMessage(content, type);
            }
          }
          this.publishStatsTimer[streamId] = setInterval(async () => {
            const audioResult = await this.octopusRTC.getLocalAudioStats(
              streamId
            );
            const videoResult = await this.octopusRTC.getLocalVideoStats(
              streamId
            );
            console.log("publish stats result:::", audioResult, videoResult);
          }, 2000);
        }
      );
      this.octopusRTC.on("stream-update", ({ code, streamList }) => {
        console.log("onStreamUpdated:::", code, streamList);
        const type = code;
        if (type == 1) {
          streamList.forEach(async (stream, index) => {
            if (stream.userId == this.userId) {
              streamList.splice(index, 1);
            }
            this.$toast({
              content: `${stream.userId}${this.$t("m.joinRoom")}`,
            });
            this.streamList.push({
              userId: stream.userId,
              streamId: stream.streamId,
              roomId: stream.roomId,
              stream: await this.palyStream(stream.userId),
            });
          });
          if (!this.isShowRightList) {
            this.isShowRightList = true;
          }
        } else if (type == 0) {
          setTimeout(() => {
            this.close();
          }, 2000);
        }
      });
    },
    foldFun() {
      if (this.isShowRightList) {
        this.isShowRightList = false;
      } else {
        this.isShowRightList = true;
      }
    },
    live() {
      this.isActiveShare = !this.isActiveShare;
      this.isShowLive = !this.isShowLive;
    },
    async display() {
      if (this.isActiveShare) {
        this.isActiveShare = false;
        if (this.scene == "audio") {
          this.$store.commit("updateScene", "audio");
        } else {
          this.$store.commit("updateScene", "video");
        }
        const stream = await this.startPreview({
          camera: {
            audio: true,
            audioInput: this.currentConfig.audioDevices,
            video: this.scene == "audio" ? false : true,
            videoInput: this.currentConfig.videoDevices,
            videoQuality: this.currentConfig.resolution,
            bitRate: 900,
          },
        });
        console.log("display stream::", stream);
        this.streamList.forEach((item) => {
          if (item.userId == this.userId) {
            this.octopusRTC.replaceTrack(
              item.stream,
              stream.getVideoTracks()[0],
              this.userId
            );
          }
        });
      } else {
        this.isActiveShare = true;
        const stream = await this.startPreview({
          screen: {
            audio: true,
          },
        }).catch((e) => {
          console.log("startCreatStream:::", e);
          this.isActiveShare = false;
          return;
        });
        console.log("display stream::", stream);
        if (stream) {
          this.$store.commit("updateScene", "share");
          this.streamList.forEach((item) => {
            if (item.userId == this.userId) {
              this.octopusRTC.replaceTrack(
                item.stream,
                stream.getVideoTracks()[0],
                this.userId
              );
            }
          });
        }
      }
    },
    async mute() {
      console.log("click mute:::");
      if (this.isActiveMute) {
        this.isActiveMute = false;
        this.lvcEngine.muteSwitch(this.userId, false);
        this.$toast({ content: "已取消静音" });
      } else {
        this.isActiveMute = true;
        this.octopusRTC.muteSwitch(this.userId, true);
        this.$toast({ content: "已静音" });
      }
      let type = "linkv_enable_mic";
      await this.lvcEngine.liveroomManager.sendDIYMessage(
        this.roomId,
        this.isActiveMute ? "1" : "0",
        type
      );
    },
    // join() {
    //   if (!this.isShowJoin) {
    //     this.isShowJoin = true;
    //     this.createVideoElement();
    //   } else {
    //     this.isShowJoin = false;
    //     this.stopPublishStream();
    //     this.streamList.splice(1, 1);
    //     if (this.isActiveMute) {
    //       this.isActiveMute = false;
    //     }
    //     if (this.isActiveCamera) {
    //       this.isActiveCamera = false;
    //     }
    //   }
    // },
    async record() {
      console.log("click record:::");
      let type = "linkv_enable_video";
      if (this.isActiveCamera) {
        this.isActiveCamera = false;
        this.lvcEngine.cameraSwitch(this.userId, "open");
        await this.lvcEngine.liveroomManager.sendDIYMessage(
          this.roomId,
          "1",
          type
        );
      } else {
        this.isActiveCamera = true;
        this.lvcEngine.cameraSwitch(this.userId, "close");
        await this.lvcEngine.liveroomManager.sendDIYMessage(
          this.roomId,
          "0",
          type
        );
      }
    },
    set() {
      if (!this.isActiveShare) {
        this.isShowSet = true;
      }
      console.log("click set:::");
    },
    async getSettings(res) {
      console.log("getSettings:::", res, this.currentConfig);
      let constrains = {
        audio: {},
        video: {},
      };
      for (const [prop, value] of Object.entries(res)) {
        if (this.currentConfig[prop] != value) {
          this.currentConfig[prop] = value;
          switch (prop) {
            case "audioDevices":
              constrains.audio[prop] = value;
              break;
            case "videoDevices":
              constrains.video[prop] = value;
              break;
            case "resolution":
              constrains.video[prop] = value;
              break;
          }
        }
      }
      if (Object.keys(constrains.audio).length == 0) {
        delete constrains.audio;
      }
      if (Object.keys(constrains.video).length == 0) {
        delete constrains.video;
      }
      if (Object.keys(constrains).length !== 0) {
        let result;
        if (constrains.audio) {
          result = await this.octopusRTC.changeConstraints(
            this.previewResult,
            "audio",
            {
              ...constrains.audio,
              audioInput: constrains.audio.audioDevices,
            },
            this.userId
          );
          // 如果当前为静音状态，则更改状态
          if (constrains.audio.audioDevices) {
            if (this.isActiveMute) {
              this.isActiveMute = false;
            }
          }
        } else if (constrains.video) {
          // const result = await this.octopusRTC.changeVideoConstrains(constrains.video);

          result = await this.octopusRTC.changeConstraints(
            this.previewResult,
            "video",
            {
              ...constrains.video,
              videoInput: constrains.video.videoDevices,
              videoQuality: constrains.video.resolution,
            },
            this.userId
          );

          if (constrains.video.videoDevices) {
            if (this.isActiveCamera) {
              this.isActiveCamera = false;
            }
          }
        }

        if (result && result.code == 600000) {
          // this.$toast({content: `分辨率已修改为${this.resolutionObj[constrains.video.resolution - 1]}`});
          this.$toast({ content: "修改成功~" });
        } else {
          this.$toast({ content: "修改失败。" });
        }
      }
      console.log("constrains:::", constrains, this.currentConfig);
    },
    close() {
      console.log("click close:::", this.streamList, this.isShowJoin);
      this.isClosed = true;
      this.streamList.forEach((value) => {
        if (value.userId == this.userId) {
          this.stopPublishStream();
        } else {
          this.lvcEngine.stopPlayingStream(value.streamId);
          clearInterval(this.playStatsTimer[value.streamId]);
        }
      });
      this.lvcEngine.logout();
      this.$router.push({ name: "Home" });
    },
  },
  beforeDestroy() {
    if (!this.isClosed && this.octopusRTC) {
      this.close();
    }
  },
  destroyed() {
    console.log("destroyed");
  },
};
</script>
<style lang="less" scope>
@import url("../assets/css/common.less");
.meet {
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.92);
    padding-top: 113px;
    box-sizing: border-box;
    position: relative;
    .local-video {
      position: absolute;
      top: 133px;
      left: 10px;
      width: 300px;
      height: 175px;
      border: 1px dashed #dddddd;
      z-index: 1;
    }
    .cover-video {
      width: 100%;
      height: 100%;
      position: relative;
      &.loading {
        background: url("../assets/images/avatar.png") no-repeat;
        background-size: 40%;
        background-position: center;
        filter: blur(8px);
        z-index: 2;
      }
    }
    .rignt-fixed {
      height: 100%;
      padding-top: 113px;
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      transition: 0.6s;
      visibility: 0;
      opacity: 0;
      width: 0;
      &.active {
        opacity: 1;
        visibility: 1;
        width: 336px;
      }
      .list {
        width: 100%;
        height: 100%;
        background: rgba(37, 41, 46, 0.8);
        padding: 18px;
        overflow: scroll;
        box-sizing: border-box;
        .cell {
          height: 175px;
          border: 1px dashed #dddddd;
          margin-bottom: 16px;
          position: relative;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .right-button-fixed {
    position: absolute;
    width: 24px;
    height: 100px;
    background-image: url("../assets/images/toggle1.png");
    background-repeat: no-repeat;
    background-size: cover;
    right: 0;
    top: 50%;
    z-index: 1;
    transition: 0.6s;
    &.btn-active {
      right: 336px;
      transition: 0.6s;
    }
    .triangle {
      width: 16px;
      height: 20px;
      background: url("../assets/images/toggle2.png") no-repeat;
      background-size: cover;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -10px;
      transform: scaleX(-1);
      &.triangle-active {
        transform: rotate(360deg);
        transition: 0.6s;
      }
    }
  }
  .tool {
    position: absolute;
    width: 418px;
    height: 66px;
    background: rgba(37, 41, 46, 0.8);
    border-radius: 36px;
    left: 50%;
    margin-left: -209px;
    bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      width: 38px;
      height: 38px;
      margin-right: 36px;
      &.share {
        background: url("../assets/images/share.png") no-repeat;
        background-size: cover;
        &.active {
          background-image: url("../assets/images/disable-share.png");
        }
      }
      &.mute {
        background: url("../assets/images/volume.png") no-repeat;
        background-size: cover;
        &.active {
          background-image: url("../assets/images/disable-volume.png");
        }
      }
      &.join {
        background-image: url("../assets/images/ring.png");
        background-repeat: no-repeat;
        background-size: cover;
        &.active {
          background-image: url("../assets/images/ring-active.png");
        }
      }
      &.record {
        background: url("../assets/images/video.png") no-repeat;
        background-size: cover;
        &.active {
          background-image: url("../assets/images/disable-video.png");
        }
      }
      &.set {
        background: url("../assets/images/set.png") no-repeat;
        background-size: cover;
      }
      &.close {
        background: url("../assets/images/hangup.png") no-repeat;
        background-size: cover;
        margin-right: 0;
      }
    }
  }
}
@import "../assets/css/mobile/meet.less";
</style>
