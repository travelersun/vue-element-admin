import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import VXETable from 'vxe-table'
import XEAjax from 'xe-ajax'
import VXEAjax from 'vxe-ajax'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import 'vxe-table/lib/index.css'

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
/*
VXETable.setup({
  // 默认表格参数
  size: 'small',
  showOverflow: null,
  showHeaderOverflow: null,
  align: null,
  headerAlign: null,
  stripe: false,
  border: false,
  resizable: false,
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,
  highlightHoverRow: false,
  highlightCurrentColumn: false,
  highlightHoverColumn: false,
  rowId: '_XID',
  sortConfig: {
    trigger: 'default'
  },
  validConfig: {
    message: 'default'
  },
  // 版本号（对于某些带 Storage 数据储存的功能有用到，上升版本号可以用于重置 Storage 数据）
  version: 0,
  // 自定义图标配置（如果全部图标都使用自定义，就不需要引入 Icon 模块了，减少体积）
  icon: {
    sortAsc: 'vxe-icon--caret-top',
    sortDesc: 'vxe-icon--caret-bottom',
    filter: 'vxe-icon--funnel',
    edit: 'vxe-icon--edit-outline',
    tree: 'vxe-icon--caret-right',
    refresh: 'vxe-icon--refresh',
    custom: 'vxe-icon--menu',
    jumpPrev: 'vxe-icon--d-arrow-left',
    jumpNext: 'vxe-icon--d-arrow-right',
    prevPage: 'vxe-icon--arrow-left',
    nextPage: 'vxe-icon--arrow-right',
    msgClose: 'vxe-icon--close',
    msgInfo: 'vxe-icon--info',
    msgSuccess: 'vxe-icon--success',
    msgWarning: 'vxe-icon--warning',
    msgError: 'vxe-icon--error',
    msgQuestion: 'vxe-icon--question',
    msgLoading: 'vxe-icon--refresh roll',
    caretBottom: 'vxe-icon--caret-bottom',
    dropdownBottom: 'vxe-icon--arrow-bottom'
  },
  // 配置式表格的默认参数
  grid: {
    proxyConfig: {
      autoLoad: true,
      message: true,
      props: {
        list: null,
        result: 'result',
        total: 'page.total'
      }
    }
  },
  // 默认快捷菜单
  menu: {},
  // 默认 tooltip 主题样式
  tooltip: {
    zIndex: 99,
    theme: 'dark'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 15, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'] // 非常灵活的分页布局，支持任意位置随意换
  },
  // 默认工具栏参数
  toolbar: {
    refresh: false,
    resizable: {
      storage: false
    },
    setting: {
      storage: false
    },
    buttons: []
  },
  // 默认消息提示框参数
  message: {
    zIndex: 999,
    lockView: true,
    lockScroll: true,
    mask: true,
    duration: 3000,
    animat: true
  },
  // 默认优化配置项
  optimization: {
    animat: true,
    // 当表头大于 40 列时自动启用横向 X 滚动渲染
    scrollX: {
      gt: 40,
      oSize: 5,
      rSize: 16
    },
    // 当行数据大于 500 条时自动启用纵向 Y 滚动渲染
    scrollY: {
      gt: 200,
      oSize: 20,
      rSize: 80
    }
  },
  // 集成国际化（将对列头、校验提示..进行自动翻译）
  translate: key => i18n.t(key)
})
*/

VXETable.setup({
  // 默认模态窗口参数
  modal: {
    zIndex: 3000,
    minWidth: 340,
    minHeight: 200,
    lockView: true,
    lockScroll: true,
    mask: true,
    duration: 3000,
    animat: true
  }
})

Vue.use(VXETable)
Vue.use(VXEAjax, XEAjax)
Vue.use(VXEUtils, XEUtils, { mounts: ['cookie'] })
VXETable.use(VXETablePluginElement)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
