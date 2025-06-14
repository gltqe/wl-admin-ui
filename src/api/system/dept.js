import request from '@/request/index.js'

export function getDeptByUser (dept) {
  return request({
    url: 'sysDept/getDeptByUser',
    method: 'post',
    data: dept
  })
}

export function updateStatus (data) {
  return request({
    url: 'sysDept/updateStatus',
    method: 'post',
    data: data
  })
}
export function add (data) {
  return request({
    url: 'sysDept/add',
    method: 'post',
    data: data
  })
}
export function getOne (data) {
  return request({
    url: 'sysDept/getOne',
    method: 'post',
    data: data
  })
}
export function update (data) {
  return request({
    url: 'sysDept/update',
    method: 'post',
    data: data
  })
}
export function remove (data) {
  return request({
    url: 'sysDept/remove',
    method: 'post',
    data: data
  })
}
