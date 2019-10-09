import requestFnd from '@/utils/requestFnd'

export function list(params) {
  return requestFnd({
    url: '/fndDataDict/list',
    method: 'get',
    params: { params }
  })
}

export function save(params) {
  return requestFnd({
    url: '/fndDataDict/save',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return requestFnd({
    url: '/fndDataDict/delete',
    method: 'post',
    data: params
  })
}

export function listDictTree(params) {
  return requestFnd({
    url: '/fndDataDict/tree/list',
    method: 'get',
    params: { params }
  })
}

export function listDictFlat(params) {
  return requestFnd({
    url: '/fndDataDict/flat/list',
    method: 'get',
    params: { params }
  })
}

export function listDictEntry(params) {
  return requestFnd({
    url: '/fndDataDict/entry/list',
    method: 'get',
    params: { params }
  })
}

export function saveDictEntry(params) {
  return requestFnd({
    url: '/fndDataDict/entry/save',
    method: 'post',
    data: params
  })
}

export function delDictEntry(params) {
  return requestFnd({
    url: '/fndDataDict/entry/delete',
    method: 'post',
    data: params
  })
}
