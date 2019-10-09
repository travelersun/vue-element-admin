import requestUaa from '@/utils/requestUaa'
import Qs from 'qs'

export function get(groupId) {
  return requestUaa({
    url: '/Groups/' + groupId,
    method: 'get'
  })
}

export function list(params) {
  return requestUaa({
    url: '/Groups',
    method: 'get',
    params: params,
    paramsSerializer: function(params) {
      return Qs.stringify(params);
    }
  })
}

export function create(params) {
  return requestUaa({
    url: '/Groups',
    method: 'post',
    data: params
  })
}

export function update(groupId, params) {
  return requestUaa({
    url: '/Groups/' + groupId,
    method: 'put',
    data: params,
    headers: { 'If-Match': '*' }// 设置header信息
  })
}

export function del(groupId) {
  return requestUaa({
    url: '/Groups/' + groupId,
    method: 'delete'
  })
}

export function checkMember(groupId, memberId) {
  return requestUaa({
    url: `/Groups/${groupId}/members/${memberId}`,
    method: 'get'
  })
}

export function addMember(groupId, params) {
  return requestUaa({
    url: `/Groups/${groupId}/members`,
    method: 'post',
    data: params
  })
}

export function removeMember(groupId, memberId) {
  return requestUaa({
    url: `/Groups/${groupId}/members/${memberId}`,
    method: 'delete'
  })
}

export function listMember(groupId, returnEntities) {
  return requestUaa({
    url: `/Groups/${groupId}/members?returnEntities=${returnEntities}`,
    method: 'get'
  })
}
