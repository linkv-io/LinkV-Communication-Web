# LinkV-Communication

此SDK主要是对 LinkV [音视频SDK](https://doc-zh.linkv.sg/web/rtc/api)和 [IM SDK](https://doc-zh.linkv.sg/web/im/api)的一层封装，使其接口更加简单易用。所有封装的代码都在 `LVCEngine` 文件夹下，您可以参考此文档或者 [demo](https://linkv-rtc-web.linkv.fun/) 来实现功能。当然您也可以在项目中直接引用[LinkV音视频SDK](https://doc-zh.linkv.sg/web/rtc/api)和[IM SDK](https://doc-zh.linkv.sg/web/im/api)相关的类来实现更加复杂的功能。

# 一、如何集成

## 下载SDK

直接引入 LVCEngine 下的 js 文件到本地。

# 二、 如何使用LVCEngine

## 前提条件

首先需要在 [开发者平台](https://dev.linkv.sg/) 注册账号，创建应用，然后获取 **SDK** 鉴权需要的 `appID` 和 `appSecret` ，在实现直播之前，请确认您已完成以下操作：

* [创建应用、获取 appID 和 appSecret](https://doc-zh.linkv.sg/platform/info/quick_start)
* Web 站点必须为 localhost 或 https


## 2.1 获取 im 和 rtc appId 和 appkey(只有 im 使用) 
```js
/***
 * appId  通过开发
 * appSecret  appSecret
 */
   async getInfo() {
      try {
        const result = await this.$http({
          data: {
            key: appID,
            content:appSecret
          method: "post",
          url: "/linkv_decrypt",
          baseURL: "https://linkv-rtc-web.linkv.fun/",
        });
        console.log(result)
      } catch (error) {
        console.log("getInfo error", error);
      }
    }
```

## 2.2 初始化SDK

```js
/**
 *  userId    string  用户id
 *  imAppId   string  im appId
 *  rtcAppId  string  rtc appID
 *  appKey    string  im appKey
 *  [socketUrl] string  im 连接的 socketurl 
 *  [env]       string  SDK环境选择
 *  [appPackageName] string 包名
 *  token  im token  (你需要通过server to server方式获取IM的toke,然后传入)
*/

  const lvcEngine = new LVCEngine({userId,imAppId,rtcAppId,appKey,socketUrl,env,appPackageName,type,token})
```
## 2.3 登录SDK

```js
lvcEngine.login().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})
```

## 2.4 设置IM私信事件监听

> 建议在初始化**sdk**时注册 IM 事件，如不注册，私信消息和房间消息都将无法收到。

```js
const  { personalManager} = lvcEngine
    personalManager.on("message",(value)=>{

    })
```

## 2.5 发送私信

`私信:`即点对点IM消息，发送给指定userId的用户

```js
/**
 *  userId   string 用户id
 *  content  string 需要发送的内容
 *  type     string 消息类型
*/

personalManager.sendEventMessage(userId,content,type).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})
```

# 三、使用LVCEngine实现直播间功能

## 3.1 登录房间

```js
/**
 *  roomId 用户id
 *  role  1 2 角色
 *  auth  鉴权签名值
 *  expire 过期时间戳
*/

let lvcEngine.joinRoom(roomId,role);
```

## 3.2 发送直播间消息

```js
/**
 *  roomId 用户id
 *  content 消息内容
 *  type 消息类型
*/
let lvcEngine.liveroomManager.sendDIYMessage(
          roomId,
          content,
          type
        );
```

并实现事件注册

```js
cosnt  {liveroomManager} = lvcEngine
/**
 * 网络断开连接
 * 
*/
 lvcEngine.on("disconnect",(err) => {
        console.log("disconnect", err);
      });
/**
 * 房间人员变更
 * code  0 人员离开 1人员加入 
 * streamList 
*/
 lvcEngine.on("stream-update",({code,streamList})=>{
 })      
/**
 * 拉流状态变更
 * code 0 拉流失败 1 拉流成功
 * streamId 流Id
 * state 状态  NO_PLAY PLAYING
*/
lvcEngine.on("play-state-update", ({code,streamId,state})=>{

})
/**
 * 推流状态变更
 * code 0 推流失败 1 推流成功
 * state 状态 NO_PUBLISH PUBLISHING
*/
lvcEngine.on("publish-state-update", ({code,streamId,state})=>{

})

/**
 * 直播间消息
 * 
*/
liveroomManager.on("message",(value)=>{
    console.log(value)
})

```

## 3.2 添加预览视图并往服务器推流

在**登录房间成功的回调**里 `添加预览视图` 和 `推流`

```js
// 添加预览视图
lvcEngine.createStream(source).then(stream=>{
    console.log(stream)
}).catch(err=>{
    console.log(err)
})
// 
lvcEngine.startPublishingStream(streamId,mediastream)
```

## 3.3 拉取或者停止拉取房间中其他人的视频流

在 `stream-update` 这个回调中拉取或者停止拉取他人的视频流

```js
// 拉取
lvcEngine.startPlayingStream(userId).then(mediastream=>{
    console.log(mediastream)
}).catch(err=>{
    cosnole.log(err)
})
// 停止拉取
lvcEngine.stopPlayingStream(userId).then(()=>{

}).catch(err=>{
    cosnole.log(err)
})
```

## 3.4 退出房间

```js
lvcEngine.logout()
```

# 四 api 接口文档

详细的 api 接口文档请点击[查看](https://doc-zh.linkv.sg/web/chat/api)




