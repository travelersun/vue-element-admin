/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/orgUnits/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/orgUnits/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/orgUnits/delete',
        method: 'post',
        data: params
    })
}

export function listOrgInfo(params) {
    return requestFnd({
        url: '/orgUnits/info/list',
        method: 'get',
        params: { params }
    })
}

export function saveOrgInfo(params) {
    return requestFnd({
        url: '/orgUnits/info/save',
        method: 'post',
        data: params
    })
}

export function delOrgInfo(params) {
    return requestFnd({
        url: '/orgUnits/info/delete',
        method: 'post',
        data: params
    })
}