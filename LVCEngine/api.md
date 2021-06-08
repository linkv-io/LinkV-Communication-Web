---
title:  LVCEngine JS SDK API 文档
description: LVCEngine JS SDK API 文档
menu: API 文档
position: 3
group_menu: API文档
group_menu_position: 1
category: chat
---

**更新时间：2020-06-03**

## LVCEngine

### 创建LVCEngine实例

new LVCEngine(userId, imAppId, rtcAppId, appKey, socketUrl, env, appPackageName, type)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | 用户的userId |
| imAppId | <code>string</code> |  | im appId |
| rtcAppId | <code>string</code> |  | rtc appId |
| appKey | <code>string</code> |  | im appKey |
| socketUrl | <code>string</code> |  | socketUrl |
| socketUrl | <code>string</code> |  | socketUrl |
| appPackageName | <code>string</code> |  | 包名 |
| env | <code>string</code> | <code>&quot;prod&quot; \| &quot;test&quot;</code> | SDK环境选择 |
| [type] | <code>string</code> | <code>&quot;international&quot; \| &quot;china&quot;</code></code> | 节点环境选择 |

### 登录房间

LVCEngine.joinRoom(userId, roomId, role, token, auth, expire) ⇒ <code>Array</code> &#124; <code>errMsg</code>

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  
**Returns**: <code>Array</code> &#124; <code>errMsg</code> - {(Promise<streamList[] | errMsg>)}  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | 用户id |
| roomId | <code>string</code> | 房间id |
| role | <code>1</code> &#124; <code>2</code> | 角色 |
| token | <code>string</code> | 鉴权token |
| auth | <code>string</code> | 鉴权签名值 |
| expire | <code>string</code> | 过期时间戳 |

### 登出房间

LVCEngine.logout() ⇒ <code>void</code>

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  
**Returns**: <code>void</code>

## RTC部分

### 创建流

LVCEngine.createStream([source]) ⇒ <code>mediastream</code>

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  
**Returns**: <code>mediastream</code> - {Promise<MediaStream>}  

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>object</code> | 视频源类型 |
| [source.camera] | <code>object</code> | 摄像头 |
| [source.screen] | <code>object</code> | 屏幕共享 |
| [source.custom] | <code>object</code> | 自定义流 |
| [source.camera.audio] | <code>boolean</code> | 是否开启音频 |
| [source.camera.video] | <code>boolean</code> | 是否开启视频 |
| [source.camera.audioInput] | <code>string</code> | 音频输入设备 |
| [source.camera.audioBitrate] | <code>number</code> | 音频码率 |
| [source.camera.videoInput] | <code>string</code> | 视频输入设备 |
| [source.camera.videoQuality] | <code>1</code> &#124; <code>2</code> &#124; <code>3</code> &#124; <code>4</code> | 视频质量 |
| [source.camera.facingMode] | <code>string</code> | 切换摄像头（移动端） |
| [source.camera.width] | <code>number</code> | 宽 |
| [source.camera.height] | <code>number</code> | 高 |
| [source.camera.frameRate] | <code>number</code> | 帧率 |
| [source.camera.bitrate] | <code>number</code> | 码率 |
| [source.camera.AGC] | <code>boolean</code> | 自动增益 |
| [source.camera.ANS] | <code>boolean</code> | 回声消除 |
| [source.camera.AEC] | <code>boolean</code> | 降噪 |
| [source.screen.audio] | <code>boolean</code> | (共享屏幕)是否开启音频 |
| [source.screen.videoQuality] | <code>1</code> &#124; <code>2</code> &#124; <code>3</code> &#124; <code>4</code> | 视频质量设置 |
| [source.screen.frameRate] | <code>number</code> | 帧率 |
| [source.screen.bitrate] | <code>number</code> | 码率 |
| source.custom.source | <code>MediaStream</code> | 视频流 |
| [source.custom.bitrate] | <code>number</code> | 码率 |

### 删除流
LVCEngine.destroyStream(mediastream)

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  

| Param | Type |
| --- | --- |
| mediastream | <code>MediaStream</code> | 

### 开始推流
LVCEngine.startPublishingStream(streamId, mediaElement) ⇒ <code>void</code>

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  
**Returns**: <code>void</code> - {Promise<void>}  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |
| mediaElement | <code>MediaStream</code> | 流 |

### 停止推流
LVCEngine.stopPublishingStream(streamId)

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |

### 开始拉流
LVCEngine.startPlayingStream(streamId) ⇒ <code>void</code>

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  
**Returns**: <code>void</code> - {(Promise<MediaStream | void>)}  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |

### 停止拉流
LVCEngine.stopPlayingStream(streamId)

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |

### 开启静音
LVCEngine.muteSwitch(streamId, mute)

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |
| mute | <code>boolean</code> | 是否静音 |

### 切换摄像头
LVCEngine.cameraSwitch(streamId, state)

**Kind**: instance method of <code>[LVCEngine](#LVCEngine)</code>  

| Param | Type | Description |
| --- | --- | --- |
| streamId | <code>string</code> | 流id |
| state | <code>&#x27;close&#x27;</code> &#124; <code>&#x27;open&#x27;</code> | 摄像头状态 |

### 流变化通知 event 
"stream-update" ⇒ <code>[stramUpdateResult](#stramUpdateResult)</code>

**Kind**: event emitted by <code>[LVCEngine](#LVCEngine)</code>  
**Since**: 2.0  

### websocket 断开通知 event.
"disconnect" ⇒ <code>[errMsg](#errMsg)</code>

**Kind**: event emitted by <code>[LVCEngine](#LVCEngine)</code>  
**Since**: 2.0  

### 踢人通知 event.
"kick-out" ⇒ <code>[kickResult](#kickResult)</code>

**Kind**: event emitted by <code>[LVCEngine](#LVCEngine)</code>  
**Since**: 2.0 

### 推流状态通知 event.
"publish-state-update" ⇒ <code>[streamStateResult](#streamStateResult)</code>

**Kind**: event emitted by <code>[LVCEngine](#LVCEngine)</code>  
**Since**: 2.0 

### 拉流状态通知 event.
"play-state-update" ⇒ <code>[streamStateResult](#streamStateResult)</code>

**Kind**: event emitted by <code>[LVCEngine](#LVCEngine)</code>  
**Since**: 2.0  

## 自定义类型

<dl>
<dt><a href="#errMsg">errMsg</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#sourceCamera">sourceCamera</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#videoQuality">videoQuality</a> : <code>1</code> | <code>2</code> | <code>3</code> | <code>4</code></dt>
<dd></dd>
<dt><a href="#stramUpdateResult">stramUpdateResult</a></dt>
<dd></dd>
<dt><a href="#kickResult">kickResult</a></dt>
<dd></dd>
<dt><a href="#streamStateResult">streamStateResult</a></dt>
<dd></dd>
</dl>

### errMsg : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| code | <code>number</code> | 
| msg | <code>string</code> | 

<a name="sourceCamera"></a>

### sourceCamera : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| audio | <code>boolean</code> | 是否开启音频 |
| video | <code>boolean</code> | 是否开启视频 |
| audioInput | <code>string</code> | 音频输入设备 |
| videoInput | <code>string</code> | 视频输入设备 |
| videoQuality | <code>number</code> | 视频质量 |
| facingMode | <code>string</code> | 摄像头朝向，"user"表示前置摄像头，"environment"表示后置摄像头 |
| width | <code>number</code> | 宽 |
| height | <code>number</code> | 高 |
| frameRate | <code>number</code> | 帧率 |
| bitrate | <code>number</code> | 码率 |
| AGC | <code>boolean</code> | 自动增益 |
| ANS | <code>boolean</code> | 回声消除 |
| AEC | <code>boolean</code> | 降噪 |

<a name="videoQuality"></a>

### videoQuality : <code>1</code> &#124; <code>2</code> &#124; <code>3</code> &#124; <code>4</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| 1 | <code>number</code> | 分辨率: 320 * 240, 帧率: 15, 码率: 300 |
| 2 | <code>number</code> | 分辨率: 640 * 480, 帧率: 15, 码率: 800 |
| 3 | <code>number</code> | 分辨率: 1280 * 720, 帧率: 20, 码率: 1500 |
| 4 | <code>number</code> | 分辨率: width * height, 帧率: frameRate, 码率: bitRate(k) |

<a name="stramUpdateResult"></a>

### stramUpdateResult
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | 标识码 1 为增加 0为减少 |
| streamList | <code>[ &#x27;Array&#x27; ].&lt;{streamId: string, userId: string, roomId: string}&gt;</code> | 流列表 |

<a name="kickResult"></a>

### kickResult
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | 用户Id |
| roomId | <code>string</code> | 房间Id |
| reason | <code>number</code> | 错误码 |

<a name="streamStateResult"></a>

### streamStateResult
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | 错误码 |
| state | <code>string</code> | 当前状态 |
| reason | <code>string</code> | 原因 |


## 直播间部分
LVCEngine.liveroomManager
**Kind**: global class    

* [LiveroomManager](#LiveroomManager)
    * [new LiveroomManager()](#new_LiveroomManager_new)
    * _instance_
        * [.create(roomId)](#LiveroomManager+create) ⇒ <code>void</code>
        * [.join(roomId)](#LiveroomManager+join) ⇒ <code>void</code>
        * [.leave(roomId)](#LiveroomManager+leave) ⇒ <code>void</code>
        * [.mute(roomId, userId)](#LiveroomManager+mute) ⇒ <code>void</code>
        * [.unmute(roomId, userId)](#LiveroomManager+unmute) ⇒ <code>void</code>
        * [.muteAll(roomId)](#LiveroomManager+muteAll) ⇒ <code>void</code>
        * [.unmuteAll(roomId)](#LiveroomManager+unmuteAll) ⇒ <code>void</code>
        * [.sendMessage(roomId, content)](#LiveroomManager+sendMessage) ⇒ <code>void</code>
    * _static_
        * ["create"](#LiveroomManager.event_create) ⇒ <code>object</code>
        * ["join"](#LiveroomManager.event_join) ⇒ <code>object</code>
        * ["leave"](#LiveroomManager.event_leave) ⇒ <code>object</code>
        * ["message"](#LiveroomManager.event_message) ⇒ <code>object</code>

<a name="LiveroomManager+create"></a>

### 创建房间

liveroomManager.create(roomId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |

<a name="LiveroomManager+join"></a>

### 加入房间

liveroomManager.join(roomId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |

<a name="LiveroomManager+leave"></a>

### 离开房间

liveroomManager.leave(roomId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |

<a name="LiveroomManager+mute"></a>

### 用户静音

liveroomManager.mute(roomId, userId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |
| userId | <code>string</code> | 用户ID |

<a name="LiveroomManager+unmute"></a>

### 用户取消静音

liveroomManager.unmute(roomId, userId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |
| userId | <code>string</code> | 用户ID |

<a name="LiveroomManager+muteAll"></a>

### 房间静音

liveroomManager.muteAll(roomId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |

<a name="LiveroomManager+unmuteAll"></a>

### 房间取消静音

liveroomManager.unmuteAll(roomId) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |

<a name="LiveroomManager+sendMessage"></a>

### 发送直播间消息

liveroomManager.sendMessage(roomId, content) ⇒ <code>void</code>

**Kind**: instance method of [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | 房间ID |
| content | <code>string</code> | 消息内容 |

<a name="LiveroomManager.event_create"></a>

### 获取创建直播间消息 event

"create" ⇒ <code>object</code>

**Kind**: event emitted by [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>object</code> - {{roomId: string, userId: string}}  
<a name="LiveroomManager.event_join"></a>

### 获取加入直播间消息 event

"join" ⇒ <code>object</code>

**Kind**: event emitted by [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>object</code> - {{roomId: string, userId: string}}  
<a name="LiveroomManager.event_leave"></a>

### 获取离开直播间消息 event

"leave" ⇒ <code>object</code>

**Kind**: event emitted by [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>object</code> - {{roomId: string, userId: string}}  
<a name="LiveroomManager.event_message"></a>

### 获取直播间实时消息 event

"message" ⇒ <code>object</code>

**Kind**: event emitted by [<code>LiveroomManager</code>](#LiveroomManager)  
**Returns**: <code>object</code> - {{from: string, to: string, content: string}}  
<a name="PersonalManager"></a>

## 私信部分
LVCEngine.personalManager
**Kind**: global class   

* [PersonalManager](#PersonalManager)
    * [new PersonalManager()](#new_PersonalManager_new)
    * _instance_
        * [.sendMessage(userId, content)](#PersonalManager+sendMessage) ⇒ <code>void</code>
        * [.sendAck(received)](#PersonalManager+sendAck) ⇒ <code>void</code>
    * _static_
        * ["message"](#PersonalManager.event_message) ⇒ <code>object</code>

<a name="PersonalManager+sendMessage"></a>

### 发送私信

personalManager.sendMessage(userId, content) ⇒ <code>void</code>

**Kind**: instance method of [<code>PersonalManager</code>](#PersonalManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | 用户ID |
| content | <code>string</code> | 消息内容 |

<a name="PersonalManager+sendAck"></a>

### 发送接收反馈

personalManager.sendAck(received) ⇒ <code>void</code>

**Kind**: instance method of [<code>PersonalManager</code>](#PersonalManager)  
**Returns**: <code>void</code> - {Promise\<void\>}  

| Param | Type |
| --- | --- |
| received | <code>Array.&lt;TextMsgDataWrapper&gt;</code> | 

<a name="PersonalManager.event_message"></a>

### 获取私信消息 event

"message" ⇒ <code>object</code>

**Kind**: event emitted by [<code>PersonalManager</code>](#PersonalManager)  
**Returns**: <code>object</code> - {{from: string, to: string, content: string}}  

### 获取未读消息列表

pullManager.getUnreadMessageList([sequenceId], [totalSize]) ⇒ <code>object</code>

**Kind**: instance method of [<code>PullManager</code>](#PullManager)  
**Returns**: <code>object</code> - {Promise<[type: string, message: string]>}  

| Param | Type | Default |
| --- | --- | --- |
| [sequenceId] | <code>number</code> \| <code>Long</code> | <code>0</code> | 
| [totalSize] | <code>number</code> | <code>-1</code> | 

<a name="event_error"></a>

### 获取错误消息 event

"error" ⇒ <code>object</code>

**Kind**: event emitted  
**Returns**: <code>object</code> - {type: number, data: any, error: string}  
