import request from '@/utils/request'
import requestUaa from '@/utils/requestUaa'
import requestFnd from '@/utils/requestFnd'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return requestFnd({
    url: '/user/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return requestUaa({
    url: '/logout',
    method: 'post',
    baseURL: '/'
  })
}

export function logoutUaa() {
  return requestUaa({
    url: '/logout',
    method: 'post'
  })
}

export function directResp(userId) {
  return requestFnd({
    url: `/user/${userId}/directResp`,
    method: 'get'
  })
}

export function addDirectResp(userId, params) {
  return requestFnd({
    url: `/user/${userId}/directResp`,
    method: 'post',
    data: params
  })
}

export function delDirectResp(userId, params) {
  return requestFnd({
    url: `/user/${userId}/directResp`,
    method: 'delete',
    data: params
  })
}
