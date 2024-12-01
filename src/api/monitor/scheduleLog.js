import request from '@/request/index'

export function getScheduleLogList(data) {
    return request({
        url: 'scheduleLog/page',
        method: 'post',
        data: data
    })
}

export function getOne(data) {
    return request({
        url: 'scheduleLog/getOne',
        method: 'post',
        data: data
    })
}
