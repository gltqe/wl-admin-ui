import request from '@/request/index'

export function getLoginLogPage (data) {
  return request({
    url: 'loginLog/page',
    method: 'post',
    data: data
  })
}

export function getOne (data) {
  return request({
    url: 'loginLog/getOne',
    method: 'post',
    data:data
  })
}

export function remove (ids) {
  return request({
    url: 'loginLog/remove',
    method: 'post',
    data: ids
  })
}
