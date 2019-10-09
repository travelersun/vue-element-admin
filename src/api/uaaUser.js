import requestUaa from '@/utils/requestUaa'
import Qs from 'qs'

export function get(userId) {
  return requestUaa({
    url: '/Users/' + userId,
    method: 'get'
  })
}

export function list(params) {
  return requestUaa({
    url: '/Users',
    method: 'get',
    params: params,
    paramsSerializer: function(params) {
      return Qs.stringify(params);
    }
  })
}

export function create(params) {
  return requestUaa({
    url: '/Users',
    method: 'post',
    data: params
  })
}

export function update(userId, params) {
  return requestUaa({
    url: '/Users/' + userId,
    method: 'put',
    data: params,
    headers: { 'If-Match': '*' }// 设置header信息
  })
}

export function del(userId) {
  return requestUaa({
    url: '/Users/' + userId,
    method: 'delete'
  })
}

export function chgpassword(userId, oldPassword, password) {
  return requestUaa({
    url: '/Users/' + userId + '/password',
    method: 'put',
    data: { 'oldPassword': oldPassword, 'password': password }
  })
}
