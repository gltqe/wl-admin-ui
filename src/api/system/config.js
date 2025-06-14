import request from '@/request'

export function page (data) {
  return request({
    url: 'sysConfig/page',
    method: 'post',
    data: data
  })
}

export function updateStatus (data) {
  return request({
    url: 'sysConfig/updateStatus',
    method: 'post',
    data: data
  })
}
export function add (data) {
  return request({
    url: 'sysConfig/add',
    method: 'post',
    data: data
  })
}
export function getOne (data) {
  return request({
    url: 'sysConfig/getOne',
    method: 'post',
    data: data
  })
}
export function update (data) {
  return request({
    url: 'sysConfig/update',
    method: 'post',
    data: data
  })
}

export function remove (data) {
  return request({
    url: 'sysConfig/remove',
    method: 'post',
    data: data
  })
}

export function refresh () {
  return request({
    url: 'sysConfig/refresh',
    method: 'post'
  })
}
