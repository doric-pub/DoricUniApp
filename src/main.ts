import Vue from 'vue'
import App from './App.vue'

import DoricNode from '@/doric/shader/doric-node/index.vue'
import computeSizeMinxn from '@/global/mixins/computeSize'
Vue.mixin(computeSizeMinxn)
Vue.config.productionTip = false
Vue.component('DoricNode', DoricNode)
new App().$mount()
