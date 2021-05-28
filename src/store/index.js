import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    storeSettingsConfig: {},
    resultSettingConfig: {},
    scene: '',
    env: ''
  },
  mutations: {
    setSettingsConfig(state, n) {
      state.storeSettingsConfig = n;
    },
    setResultSettingConfig(state, n) {
      state.resultSettingConfig = n;
    },
    updateScene(state, n) {
      state.scene = n;
    },
    updateEnv(state, n) {
      state.env = n;
    }
  },
  actions: {
    // setDevicesInfo (context, n) {
    // 	context.commit('setSettingsConfig', n);
    // }
  }
})
