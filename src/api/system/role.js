import request from '@/request/index.js'

export function page (queryForm) {
  return request({
    url: 'sysRole/page',
    method: 'post',
    data: queryForm
  })
}
export function getRoleByUser () {
  return request({
    url: 'sysRole/getRoleByUser',
    method: 'post'
  })
}
export function updateStatus (role) {
  return request({
    url: 'sysRole/updateStatus',
    method: 'post',
    data: role
  })
}
export function add (role) {
  return request({
    url: 'sysRole/add',
    method: 'post',
    data: role
  })
}
export function getOne (data) {
  return request({
    url: 'sysRole/getOne',
    method: 'post',
    data: data
  })
}
export function update (role) {
  return request({
    url: 'sysRole/update',
    method: 'post',
    data: role
  })
}

export function remove (ids) {
  return request({
    url: 'sysRole/remove',
    method: 'post',
    data: ids
  })
}
