import requestUaa from '@/utils/requestUaa'
import Qs from 'qs'

export function get(clientId) {
  return requestUaa({
    url: `/oauth/clients/${clientId}`,
    method: 'get'
  })
}

export function list(params) {
  return requestUaa({
    url: '/oauth/clients',
    method: 'get',
    params: params,
    paramsSerializer: function(params) {
      return Qs.stringify(params);
    }
  })
}

export function create(params) {
  return requestUaa({
    url: '/oauth/clients',
    method: 'post',
    data: params
  })
}

export function update(clientId, params) {
  return requestUaa({
    url: `/oauth/clients/${clientId}`,
    method: 'put',
    data: params
  })
}

export function del(clientId) {
  return requestUaa({
    url: `/oauth/clients/${clientId}`,
    method: 'delete'
  })
}

export function chgpassword(clientId, oldSecret, secret) {
  return requestUaa({
    url: `/oauth/clients/${clientId}/secret`,
    method: 'put',
    data: { 'clientId': clientId, 'oldSecret': oldSecret, 'secret': secret }
  })
}
