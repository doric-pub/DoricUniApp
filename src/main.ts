import Vue from 'vue'
import App from './App.vue'

import DoricNode from '@/doric/shader/doric-node/index.vue'
import computeSizeMinxin from '@/global/mixins/computeSize'

import { doricInterface } from './doric/interface'

Vue.mixin(computeSizeMinxin)
Vue.config.productionTip = false
Vue.component('DoricNode', DoricNode)

doricInterface.showToast = uni.showToast
doricInterface.showModal = uni.showModal

doricInterface.setStorage = uni.setStorage
doricInterface.getStorage = uni.getStorage
doricInterface.removeStorage = uni.removeStorage
doricInterface.getStorageInfo = uni.getStorageInfo
doricInterface.removeStorageSync = uni.removeStorageSync

doricInterface.request = uni.request

doricInterface.createAnimation = uni.createAnimation

new App().$mount()
