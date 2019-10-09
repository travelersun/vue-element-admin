/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/responsibility/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/responsibility/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/responsibility/delete',
        method: 'post',
        data: params
    })
}


export function listExclusion(params) {
    return requestFnd({
        url: '/responsibility/exclusion/list',
        method: 'get',
        params: { params }
    })
}

export function saveExclusion(params) {
    return requestFnd({
        url: '/responsibility/exclusion/save',
        method: 'post',
        data: params
    })
}

export function delExclusion(params) {
    return requestFnd({
        url: '/responsibility/exclusion/delete',
        method: 'post',
        data: params
    })
}