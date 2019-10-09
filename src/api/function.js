/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/function/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/function/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/function/delete',
        method: 'post',
        data: params
    })
}
