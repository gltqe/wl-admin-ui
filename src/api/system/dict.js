import request from '@/request'

export function getDict(data) {
    return request({
        url: 'sysDict/getDict',
        method: 'post',
        data: data
    })
}

export function page(data) {
    return request({
        url: 'sysDict/page',
        method: 'post',
        data: data
    })
}

export function updateStatus(dict) {
    return request({
        url: 'sysDict/updateStatus',
        method: 'post',
        data: dict
    })
}

export function add(dict) {
    return request({
        url: 'sysDict/add',
        method: 'post',
        data: dict
    })
}

export function getOne(data) {
    return request({
        url: 'sysDict/getOne',
        method: 'post',
        data: data
    })
}

export function update(dict) {
    return request({
        url: 'sysDict/update',
        method: 'post',
        data: dict
    })
}

export function remove(codes) {
    return request({
        url: 'sysDict/remove',
        method: 'post',
        data: codes
    })
}

export function refresh() {
    return request({
        url: 'sysDict/refresh',
        method: 'post'
    })
}
