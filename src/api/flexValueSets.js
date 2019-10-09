/* eslint-disable */
import requestFnd from '@/utils/requestFnd'


export function list(params) {
    return requestFnd({
        url: '/flexValueSets/list',
        method: 'get',
        params: { params }
    })
}

export function save(params) {
    return requestFnd({
        url: '/flexValueSets/save',
        method: 'post',
        data: params
    })
}

export function del(params) {
    return requestFnd({
        url: '/flexValueSets/delete',
        method: 'post',
        data: params
    })
}


export function listValidationTable(params) {
    return requestFnd({
        url: '/flexValueSets/validationTable/list',
        method: 'get',
        params: { params }
    })
}

export function listValueSetDefine(params) {
    return requestFnd({
        url: '/flexValueSets/define/list',
        method: 'get',
        params: { params }
    })
}

export function listValueSetValue(params) {
    return requestFnd({
        url: '/flexValueSets/value/list',
        method: 'get',
        params: { params }
    })
}