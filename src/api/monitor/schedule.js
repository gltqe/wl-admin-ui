import request from '@/request/index'

export function getScheduleList (data) {
    return request({
        url: 'schedule/page',
        method: 'post',
        data: data
    })
}

export function updateStatus (data) {
    return request({
        url: 'schedule/updateStatus',
        method: 'post',
        data: data
    })
}
export function add (data) {
    return request({
        url: 'schedule/add',
        method: 'post',
        data: data
    })
}
export function getOne (data) {
    return request({
        url: 'schedule/getOne',
        method: 'post',
        data: data
    })
}
export function update (data) {
    return request({
        url: 'schedule/update',
        method: 'post',
        data: data
    })
}

export function remove (data) {
    return request({
        url: 'schedule/remove',
        method: 'post',
        data: data
    })
}

export function run (data) {
    return request({
        url: 'schedule/run',
        method: 'post',
        data: data
    })
}
