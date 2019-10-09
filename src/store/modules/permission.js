import { asyncRoutesMap, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role'
import { getRootPath, isWwwLink } from '@/utils/client'
/* Layout */
import Layout from '@/layout'
import Topmenu from '@/topmenu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
  //   return true
  // }
  // just fetch from server
  return true
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function filterAsyncRouterAndParse(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = []

  asyncRouterMap.forEach(route => {
    if (route.component) {
      if (route.component === 'Layout' || route.component === 'layout/Layout') { // Layout组件特殊处理
        route.component = Layout
      } else if (route.component === 'Topmenu' || route.component === 'topmenu/Topmenu') { // Topmenu组件特殊处理
        route.component = Topmenu
      } else {
        const componentPath = route.component.substr(0, 1) === '/' ? route.component : '/' + route.component
        route.component = asyncRoutesMap[componentPath]
      }
    }
    if (route.type && route.type === 'wwwlink' && route.path) {
      if (!isWwwLink(route.path)) {
        const linkPath = route.path.substr(0, 1) === '/' ? route.path : '/' + route.path
        route.path = getRootPath() + linkPath
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouterAndParse(route.children)
    }
    accessedRouters.push(route)
  })

  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    routes.push({ path: '*', redirect: '/404', hidden: true })
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRoutes().then(response => {
        const { data } = response
        const accessedRoutes = filterAsyncRouterAndParse(data) || []
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
