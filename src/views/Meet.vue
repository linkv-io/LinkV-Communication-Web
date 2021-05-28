/* eslint-disable no-unused-vars */
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
        v-if="source == 1 && devidePlatform == 'desktop'"
      ></li>
      <li
        class="item mute"
        :class="{ active: isActiveMute }"
        @click="mute"
        v-if="source == 1 || (source == 2 && isShowJoin)"
      ></li>
      <li
        class="item join"
        :class="{ active: isShowJoin }"
        @click="join"
        v-if="source == 2"
      ></li>
      <li
        class="item record"
        :class="{ active: isActiveCamera }"
        @click="record"
        v-if="isShowRecord"
      ></li>
      <li class="item set" @click="set" v-if="source != 3"></li>
      <li class="item close" @click="close"></li>
    </ul>
    <Settings
      v-bind:isShowSet.sync="isShowSet"
      v-bind:isSettingShowVideoDeviceOptions.sync="isSettingShowVideoDevice"
      v-bind:deviceConfigObj="deviceConfigObj"
      v-bind:source="'meet'"
      v-on:get-settings="getSettings"
    />
  </div>
</template>

<script>
import Nav from "@/components/navigate.vue";
import Video from "@/components/video.vue";
import Audio from "@/components/audio.vue";
import Settings from "@/components/settings.vue";
import utils from "@/utils";
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
  },
  data() {
    return {
      userId: utils.uuid(),
      source: 0,
      roomId: "",
      streamList: [],
      currentConfig: {},
      videoMuted: false,
      // isOnlyAudio: false,
      isShowRightList: true,
      isShowJoin: false,
      isShowSet: false,
      isActiveMute: false,
      isActiveCamera: false,
      isActiveShare: false,
      resolutionObj: ["low", "middle", "hight"],
      deviceConfigObj: {
        audioDevices: [],
        videoDevices: [],
      },
      devidePlatform: "desktop",
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
    // 只有桌面端显示共享桌面按钮；
    this.isShowDisplayBtn();
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
      const crystalBallSource = this.getQueryString("source");
      this.logLevel =
        this.getQueryString("logLevel") == void 0
          ? 0
          : this.getQueryString("logLevel");
      this.enableLogUpload =
        this.getQueryString("enableLogUpload") == void 0
          ? true
          : this.getQueryString("enableLogUpload");
      let appId = "6977616048";
      let env = "prod";
      if (crystalBallSource == void 0 && routerParams.source == void 0) {
        // this.$router.push({ name: "Home" });
        return;
      } else {
        let role = 1;
        this.source = routerParams.source
          ? routerParams.source
          : crystalBallSource; // 1为推流 2为拉流 3为水晶球展示
        if (this.source == 1 || this.source == 2) {
          this.currentConfig = {
            ...this.resultSettingConfig,
            ...config[env],
          };
        } else {
          appId = this.getQueryString("appId");
          env = this.getQueryString("env");
        }
        switch (parseInt(this.source)) {
          case 1:
            this.direction = "push";
            role = 1;
            await this.getLiveRoomId();
            console.log("publish::", this.roomId, this.userId);
            break;
          case 2:
            this.direction = "pull";
            role = 2;
            this.roomId = routerParams.roomId;
            break;
          case 3:
            appId = appId == void 0 ? "1069348354" : appId;
            env = env == void 0 ? "prod" : env;
            this.roomId = this.getQueryString("roomId");
            this.direction = "pull";
            if (this.roomId == void 0) {
              this.$toast({ content: "roomId不能为空哟~" });
            }

            role = 2;
            this.currentConfig = {
              ...config[env],
              appId,
              env,
            };
            break;
          case 4:
            // eslint-disable-next-line no-case-declarations
            const direction =
              this.getQueryString("direction") == void 0
                ? 1
                : this.getQueryString("direction"); // 1: 推流 2: 拉流
            this.roomId = this.getQueryString("roomId");
            // eslint-disable-next-line no-case-declarations
            const edgeUrl = this.getQueryString("edgeUrl");
            appId = appId == void 0 ? "6977616048" : appId;
            env = env == void 0 ? "prod" : env;
            this.currentConfig = {
              ...config[env],
              edgeUrl,
              appId,
              env,
            };

            this.currentConfig.width = this.getQueryString("width");
            this.currentConfig.height = this.getQueryString("height");
            this.currentConfig.frameRate = this.getQueryString("frameRate");
            this.currentConfig.bitRate = this.getQueryString("bitRate");
            this.currentConfig.packageName = this.getQueryString("packageName");
            this.currentConfig.sampleRate = this.getQueryString("sampleRate");
            this.currentConfig.channelCount = this.getQueryString(
              "channelCount"
            );
            this.currentConfig.audioBitrate = this.getQueryString(
              "audioBitrate"
            );

            if (direction == 2 && this.roomId == void 0) {
              this.$toast({ content: "roomId不能为空哟~" });
            }

            this.direction = direction == 1 ? "push" : "pull";
            role = direction;

            this.currentConfig.resolution = 1;
            if (direction == 1) {
              await this.getLiveRoomId();
              console.log("publish::", this.roomId, this.userId);
            }
            break;
        }
        this.initOctopus();
        const streamListTemp = await this.login(role);
        if (streamListTemp.length != 0) {
          streamListTemp.forEach((value, key) => {
            if (value.userId.indexOf("H") != -1 && key != 0) {
              const temp = streamListTemp[0];
              // streamListTemp[0] = value;
              this.$set(streamListTemp, 0, value);
              streamListTemp[key] = temp;
              streamListTemp["stream"] = null;
            }
          });
        }
        this.streamList = streamListTemp;
        console.log("loginSuccess:::", this.streamList);
        this.createVideoElement();
      }
    },
    getQueryString(key) {
      var t = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i"),
        n = window.location.search.substr(1).split("?")[0].match(t);
      return null != n ? decodeURIComponent(n[2]) : null;
    },
    isShowDisplayBtn() {
      // eslint-disable-next-line no-unused-vars
      const { browser, engine, os, platform } = bowser.parse(
        window.navigator.userAgent
      );
      this.devidePlatform = platform.type;
    },
    initOctopus() {
      const _config = {
        appId: this.currentConfig.appId,
        // logLevel: 1,
        // remoteLogLevel: 1,
        userId: this.userId,
        userName: "u" + new Date().getTime(),
        roomId: this.roomId,
        env: this.currentConfig.env,
        edgeUrl: this.currentConfig.edgeUrl,
        appPackageName: this.currentConfig.packageName,
      };
      // eslint-disable-next-line no-undef
      this.octopusRTC = new OctopusRTC(_config);
      this.octopusRTC.setLogLevel(this.logLevel);
      if (this.enableLogUpload) {
        this.octopusRTC.enableLogUpload();
      } else {
        this.octopusRTC.disableLogUpload();
      }

      this.octopusRTC.init();
      this.handleCallbackFun();
    },
    async login(role) {
      // const token = await this.getOctopusToken();
      // const { auth, expire } = await this.getAuthExpire();
      // console.log('getToken::', auth, expire);

      // role 1 2
      const result = await this.octopusRTC.login(this.roomId, role, "", "");
      console.log("test login:::", result);
      return result;
    },
    createVideoElement() {
      if (this.direction == "push" || this.isShowJoin) {
        if (this.streamList.length > 1) {
          const temp = this.streamList[1];
          this.$set(this.streamList, 1, {
            userId: this.userId,
            streamId: this.userId,
            roomId: this.roomId,
          });
          this.streamList.push(temp);
        } else {
          this.streamList.push({
            userId: this.userId,
            streamId: this.userId,
            roomId: this.roomId,
          });
        }
        this.$nextTick(() => {
          this.creatPublishStream();
        });
      } else {
        if (!this.streamList.length) {
          console.log(this.$t("m.nobody"));
          this.$toast({ content: this.$t("m.nobody") });
          setTimeout(() => {
            this.close();
          }, 500);
          return;
        }
        this.getPullStreamList();
      }
    },
    async getPullStreamList() {
      for (let [index, item] of this.streamList.entries()) {
        const stream = await this.palyStream(item.userId);
        if (stream?.code == 0) {
          this.$toast({ content: `${item.userId} play failed.` });
        }
        console.log("pull play stream:::", stream);
        this.$set(item, "stream", stream);
        this.$set(this.streamList, index, item);
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
          // value.stream = this.previewResult;
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
      return this.octopusRTC.startPlayingStream(userId);
    },
    publishStream(stream) {
      this.octopusRTC.startPublishingStream(this.userId, stream);
    },
    stopPublishStream() {
      for (let item of this.streamList) {
        if (item.userId == this.userId) {
          this.octopusRTC.destroyStream(item.stream);
        }
      }
      this.octopusRTC.stopPublishingStream(this.userId);
      clearInterval(this.publishStatsTimer[this.userId]);
    },
    async startPreview(params) {
      return await this.octopusRTC.createStream(params);
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
            // if (type == 11) {
            // 	console.log('play state:::', type, this.videoStatus);
            // 	if (!this.videoStatus) {
            // 		document.getElementById(streamId).play();
            // 		document.getElementById(streamId).pause();
            // 	}
            // } else
            if (type == 1 || type == 11) {
              // this.streamPause = false;
              // this.$set(value, 'stream', stream);
              this.$set(this.streamList, key, value);
            } else if (type == 0) {
              this.$toast({ content: `${streamId}拉流失败。` });
            }
            console.log("onPlayStateUpdate:::", this.streamList);
          }
        });
        // this.octopusRTC.off('play-state-update', playCallback);
        this.playStatsTimer[streamId] = setInterval(async () => {
          const audioResult = await this.octopusRTC.getRemoteAudioStats(
            streamId
          );
          const videoResult = await this.octopusRTC.getRemoteVideoStats(
            streamId
          );
          console.log("play stats result:::", audioResult, videoResult);
        }, 2000);
      };
      this.octopusRTC.on("play-state-update", playCallback);

      // add by version2.0.0
      this.octopusRTC.on(
        "publish-state-update",
        ({ code, streamId, state }) => {
          console.log("event emit publisherStateUpdate", code, state);
          if (this.publishStatsTimer[streamId]) {
            clearInterval(this.publishStatsTimer[streamId]);
          }
          const type = code;
          if (type == 1) {
            if (this.source == 1) {
              this.updateRoom("1");
              setTimeout(() => {
                this.intervalUpdateRoom();
              }, 500);
            }
          } else if (type == 2) {
            // this.publishStream();
          } else if (type == 0) {
            this.$toast({ content: `${streamId}推流失败。` });
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
          this.streamList.forEach((value, key) => {
            if (value.userId == streamList[0].userId) {
              if (value.userId.indexOf("H") != -1) {
                this.$toast({ content: this.$t("m.anchorleave") });
                setTimeout(() => {
                  this.close();
                }, 2000);
              } else {
                this.streamList.splice(key, 1);
                this.octopusRTC.stopPlayingStream(value.userId);
                this.$toast({
                  content: `${streamList[0].userId}${this.$t("m.leaveRoom")}`,
                });
                clearInterval(this.playStatsTimer[value.userId]);
              }
            }
          });
          if (this.streamList.length == 0) {
            this.$toast({ content: this.$t("m.nobody") });
            setTimeout(() => {
              this.close();
            }, 2000);
          }
        }
      });
      // this.octopusRTC.onStreamUpdated = (type, streamList) => {

      // };
    },
    intervalUpdateRoom() {
      this.updateRoom("2");
      this.updateRoomTimer = setTimeout(() => {
        this.intervalUpdateRoom();
      }, 5 * 1000);
    },
    async getAuthExpire() {
      const res = await fetch(`${this.currentConfig.AUTHURL}/auth`);
      return {
        auth: res.auth,
        expire: res.expire_ts,
      };
    },
    async getOctopusToken() {
      const response = await fetch(
        `${this.currentConfig.BXMUrl}/api/v1/get_octopus_token`,
        {
          body: JSON.stringify({
            app_id: this.currentConfig.appId,
            user_id: this.userId,
          }),
          method: "POST",
        }
      );
      const result = await response.json();
      return result.data && result.data.token;
    },
    async getLiveRoomId() {
      try {
        const result = await fetch(
          `${this.currentConfig.BXMUrl}/api/v1/gen_room`,
          {
            body: JSON.stringify({
              app_id: this.currentConfig.appId,
            }),
            method: "POST",
          }
        );

        const res = await result.json();
        this.roomId = res.data.room_id;
        this.userId = `H${this.userId}`;
        if (this.scene == "audio") {
          this.roomId = `A${this.roomId}`;
        } else {
          this.roomId = `M${this.roomId}`;
        }
        // return result.json();
      } catch (e) {
        this.$toast({ content: "网络开小差了，请稍等再重试哟~" });
      }
    },
    async updateRoom(status) {
      console.log("updateRoom:::", status, this.currentConfig.BXMUrl);
      const result = await fetch(
        `${this.currentConfig.BXMUrl}/api/v1/update_room`,
        {
          body: JSON.stringify({
            app_id: this.currentConfig.appId,
            // room_id: `${this.currentConfig.appId}-${this.roomId}`,
            room_id: `${this.roomId}`,
            status: status,
          }),
          method: "POST",
        }
      );

      return result.json();
    },
    foldFun() {
      if (this.isShowRightList) {
        this.isShowRightList = false;
      } else {
        this.isShowRightList = true;
      }
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
    mute() {
      console.log("click mute:::");
      if (this.isActiveMute) {
        this.isActiveMute = false;
        this.octopusRTC.muteSwitch(this.userId, false);
        this.$toast({ content: "已取消静音" });
      } else {
        this.isActiveMute = true;
        this.octopusRTC.muteSwitch(this.userId, true);
        this.$toast({ content: "已静音" });
      }
    },
    join() {
      if (!this.isShowJoin) {
        this.isShowJoin = true;
        this.createVideoElement();
      } else {
        this.isShowJoin = false;
        this.stopPublishStream();
        this.streamList.splice(1, 1);
        if (this.isActiveMute) {
          this.isActiveMute = false;
        }
        if (this.isActiveCamera) {
          this.isActiveCamera = false;
        }
      }
    },
    record() {
      console.log("click record:::");
      if (this.isActiveCamera) {
        this.isActiveCamera = false;
        this.octopusRTC.cameraSwitch(this.userId, "open");
      } else {
        this.isActiveCamera = true;
        this.octopusRTC.cameraSwitch(this.userId, "close");
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
            // this.streamList.forEach((value, key) => {
            // 	if (value.userId == this.userId) {
            // 		this.$set(this.streamList, key, {
            // 			...value,
            // 			stream: result.stream
            // 		});
            // 	}
            // })
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
      clearTimeout(this.updateRoomTimer);
      if (this.source == 1) {
        this.updateRoom("3");
      }
      this.isClosed = true;
      // if (this.isShowJoin) {
      // 	this.stopPublishStream();
      // }
      // eslint-disable-next-line no-unused-vars
      this.streamList.forEach((value, key, arr) => {
        if (value.userId == this.userId) {
          this.stopPublishStream();
        } else {
          this.octopusRTC.stopPlayingStream(value.streamId);
          clearInterval(this.playStatsTimer[value.streamId]);
        }
      });
      this.octopusRTC.logout();
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
