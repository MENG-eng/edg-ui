import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import {
  Calendar
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import dataV from '@jiaminghi/data-view'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/hzdl.scss' // hzdl css
import '@/assets/styles/blog.scss' // blog css
import App from './App'
import store from './store'
import router from './router'
import echarts from "echarts"
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import {
  getDicts
} from "@/api/system/dict/data";
import {
  getConfigKey
} from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree,
  md5Hashlist,
  handleOptType,
  decimal,
  assert,
  loadingView,
  nodeShape,
  nodeSize,
  nodeOffset,
} from "@/utils/hzdl";
import Pagination from "@/components/Pagination";
//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
import EvidenceDialog from "@/components/EvidenceDialog"
import PublishDialog from "@/components/PublishDialog"

// Echarts引入
Vue.prototype.$echarts = echarts
// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.md5Hashlist = md5Hashlist
Vue.prototype.handleOptType = handleOptType
Vue.prototype.decimal = decimal
Vue.prototype.assert = assert
Vue.prototype.loadingView = loadingView;
Vue.prototype.nodeShape = nodeShape;
Vue.prototype.nodeSize = nodeSize;
Vue.prototype.nodeOffset = nodeOffset;

Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success"
  });
}

Vue.prototype.msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error"
  });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('EvidenceDialog', EvidenceDialog)
Vue.component('PublishDialog', PublishDialog)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(Calendar)

Vue.use(dataV)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
