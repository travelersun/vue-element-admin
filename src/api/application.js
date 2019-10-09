/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/fndApplication/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/fndApplication/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/fndApplication/delete',
        method: 'post',
        data: params
    })
}
