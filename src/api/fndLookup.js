/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function listLookupType(params) {
    return requestFnd({
        url: '/lookupTypes/list',
        method: 'get',
        params: { params }
    })
}

export function saveLookupType(params) {
    return requestFnd({
        url: '/lookupTypes/save',
        method: 'post',
        data: params
    })
}

export function delLookupType(params) {
    return requestFnd({
        url: '/lookupTypes/delete',
        method: 'post',
        data: params
    })
}


export function listLookupValues(params) {
    return requestFnd({
        url: '/lookupTypes/value/list',
        method: 'get',
        params: { params }
    })
}

export function saveLookupValues(params) {
    return requestFnd({
        url: '/lookupTypes/value/save',
        method: 'post',
        data: params
    })
}

export function delLookupValues(params) {
    return requestFnd({
        url: '/lookupTypes/value/delete',
        method: 'post',
        data: params
    })
}