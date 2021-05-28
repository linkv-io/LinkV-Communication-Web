/*
 * @Date: 2020-06-21 16:22:07
 * @LastEditors: GWK
 * @LastEditTime: 2020-06-22 15:05:14
 * @FilePath: /Web_Demo/src/common/lang/index.js
 */

import Vue from "vue";
import VueI18n from "vue-i18n";
let getI18n = function() {
  Vue.use(VueI18n);
  let locale = "zh";
  let lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符

  if (lang != "zh") {
    locale = "en";
  }
  const i18n = new VueI18n({
    locale: locale, // 语言标识
    messages: {
      en: require("./en"), // 英文语言包
      zh: require("./zh"), // 中文语言包
    },
  });
  return i18n;
};
export default getI18n;
