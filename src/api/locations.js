/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/locations/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/locations/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/locations/delete',
        method: 'post',
        data: params
    })
}
