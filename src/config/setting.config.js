/*
 * @Date: 2020-06-01 19:04:57
 * @LastEditors: GWK
 * @LastEditTime: 2020-06-23 11:34:21
 * @FilePath: /Web_Demo/src/config/setting.config.js
 */
import getI18n from "../locales/index";
let i18n = getI18n();
const setting = {
    "type": {
        key: "type",
        name: i18n.t("m.liveType"),
        options: [{
            key: "0",
            value: i18n.t("m.audioAndVideo")
        }, {
            key: "1",
            value: i18n.t("m.audio")
        }]
    },
    // "env": {
    //     key: "env",
    //     name: i18n.t("m.selectEnv"),
    //     options: [{
    //         key: "prod",
    //         value: i18n.t("m.prod")
    //     }, {
    //         key: "test",
    //         value: i18n.t("m.test")
    //     }] 
    // },
    "videoDevices": {
        key: "videoDevices",
        name: i18n.t("m.videoDevices"),
        options: []
    },
    "audioDevices": {
        key: "audioDevices",
        name: i18n.t('m.audioDevices'),
        options: []
    },
    "resolution": {
        key: "resolution",
        name: i18n.t('m.resolution'),
        options: [{
            key: "2",
            value: i18n.t("m.middle")
        }, {
            key: "1",
            value: i18n.t("m.low")
        }, {
            key: "3",
            value: i18n.t("m.hight")
        }]
    }
}

export default setting;
