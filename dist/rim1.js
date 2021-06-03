/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function RIM(options) {
    this._webIM = null;
    this._octopusRTC = null;
    this._rtcAppId = '';
    this._userId = '';
    this._env = "prod";
    this._edgeUrl = '';
    this._appPackageName = '';
    this._imAppId = '';
    this._appKey = '';
    this._autoConnect = '';
    this._environment = '';
    this._socketUrl = '';
    this._personalManager = '';
    this._liveroomManager = '';
    this._pullManager = '';
    this._userId = options.userId;

    if (options.environment !== void 0) { this._environment = options.environment; }
    if (options.imAppId !== void 0) { this._imAppId = options.imAppId; }
    if (options.rtcAppId !== void 0) { this._rtcAppId = options.rtcAppId; }
    if (options.appKey !== void 0) { this._appKey = options.appKey; }
    if (options.socketUrl !== void 0) { this._socketUrl = options.socketUrl; }
    if (options.env !== void 0) { this._env = options.env; };
    if (options.appPackageName !== void 0) { this._appPackageName = options.appPackageName }

    this._webIM = new webim.WebIM({
        appId: this._imAppId,
        appKey: this._appKey,
        autoConnect: this._autoConnect,
        environment: this._environment,
        socketUrl: this._socketUrl
    });



    this._personalManager = this._webIM.personalManager;
    this._liveroomManager = this._webIM.liveroomManager;
    this._pullManager = this._webIM.pullManager;
}

RIM.prototype.login = function (userId, token) {
    console.log('webIM:::', this._webIM);
    return this._webIM?.login(userId, token);
};

RIM.prototype.joinRoom = async function (userId, roomId, role, token, auth, expire) {
    this._userId = userId;
    this._octopusRTC = new OctopusRTC({
        appId: this._rtcAppId,
        userId,
        env: this._env,
        edgeUrl: this._edgeUrl,
        appPackageName: this._appPackageName,
        type: 'international'
    });
    this._octopusRTC.init();
    const imLogin = await this._liveroomManager.join(roomId);
    const rtcLogin = await this._octopusRTC?.login(roomId, role, auth, expire);
    try {
        const [imLoginResult, rtcLoginResult] = await Promise.all([imLogin, rtcLogin]);
        return rtcLoginResult;
    } catch (e) {
        throw new Error(e);
    }
}

RIM.prototype.logout = function () {
    this._webIM?.logout();
    this._octopusRTC?.logout();
}

RIM.prototype.createStream = function (source) {
    return this._octopusRTC?.createStream(source);
}

RIM.prototype.destroyStream = function (mediastream) {
    this._octopusRTC?.destroyStream(mediastream);
}

RIM.prototype.startPublishingStream = function (streamId, mediastream, extraInfo, publishOption) {
    this._octopusRTC?.startPublishingStream(streamId, mediastream, extraInfo, publishOption);
}

RIM.prototype.startPlayingStream = function (streamId, audioOutput, playOption) {
    return this._octopusRTC?.startPlayingStream(streamId, audioOutput, playOption);
}

RIM.prototype.stopPublishingStream = function (streamId) {
    this._octopusRTC?.stopPublishingStream(streamId);
}

RIM.prototype.stopPlayingStream = function (streamId) {
    this._octopusRTC?.stopPlayingStream(streamId);
}
