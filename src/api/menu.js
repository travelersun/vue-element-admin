import requestFnd from '@/utils/requestFnd'

export function list(params) {
  return requestFnd({
    url: '/menu/list',
    method: 'get',
    params: { params }
  })
}

export function save(params) {
  return requestFnd({
    url: '/menu/save',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return requestFnd({
    url: '/menu/delete',
    method: 'post',
    data: params
  })
}

export function listMenuTree(params) {
  return requestFnd({
    url: '/menu/tree/list',
    method: 'get',
    params: { params }
  })
}

export function listMenuEntry(params) {
  return requestFnd({
    url: '/menu/entry/list',
    method: 'get',
    params: { params }
  })
}

export function saveMenuEntry(params) {
  return requestFnd({
    url: '/menu/entry/save',
    method: 'post',
    data: params
  })
}

export function delMenuEntry(params) {
  return requestFnd({
    url: '/menu/entry/delete',
    method: 'post',
    data: params
  })
}
