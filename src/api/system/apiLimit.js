import request from '@/request'

export function page (data) {
  return request({
    url: 'sysApiLimit/page',
    method: 'post',
    data: data
  })
}

export function updateStatus (data) {
  return request({
    url: 'sysApiLimit/updateStatus',
    method: 'post',
    data: data
  })
}
export function add (item) {
  return request({
    url: 'sysApiLimit/add',
    method: 'post',
    data: item
  })
}
export function getOne (data) {
  return request({
    url: 'sysApiLimit/getOne',
    method: 'post',
    data: data
  })
}
export function update (data) {
  return request({
    url: 'sysApiLimit/update',
    method: 'post',
    data: data
  })
}

export function remove (data) {
  return request({
    url: 'sysApiLimit/remove',
    method: 'post',
    data: data
  })
}

export function refresh () {
  return request({
    url: 'sysApiLimit/refresh',
    method: 'post'
  })
}
