import request from '@/request/index'

export function getOperationPage (data) {
  return request({
    url: 'operationLog/page',
    method: 'post',
    data: data
  })
}

export function getOne (data) {
  return request({
    url: 'operationLog/getOne',
    method: 'post',
    params: data
  })
}

export function remove (ids) {
  return request({
    url: 'operationLog/remove',
    method: 'post',
    data: ids
  })
}
