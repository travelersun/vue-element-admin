/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/orgStructures/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/orgStructures/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/orgStructures/delete',
        method: 'post',
        data: params
    })
}

export function listOrgElementInfo(params) {
    return requestFnd({
        url: '/orgStructures/element/list',
        method: 'get',
        params: { params }
    })
}

export function listOrgTreeInfo(params) {
    return requestFnd({
        url: '/orgStructures/tree/list',
        method: 'get',
        params: { params }
    })
}

export function saveOrgElementInfo(params) {
    return requestFnd({
        url: '/orgStructures/element/save',
        method: 'post',
        data: params
    })
}

export function delOrgElementInfo(params) {
    return requestFnd({
        url: '/orgStructures/element/delete',
        method: 'post',
        data: params
    })
}