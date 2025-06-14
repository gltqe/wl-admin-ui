import request from '@/request/index.js'

export function getMenuPermission () {
  return request.post(
    'sysMenu/getMenuPermission'
  )
}
export function getMenuByUser (menu) {
  return request({
    url: 'sysMenu/getMenuByUser',
    method: 'post',
    data: menu
  })
}

export function updateStatus (menu) {
  return request({
    url: 'sysMenu/updateStatus',
    method: 'post',
    data: menu
  })
}

export function add (menu) {
  return request({
    url: 'sysMenu/add',
    method: 'post',
    data: menu
  })
}
export function getOne (data) {
  return request({
    url: 'sysMenu/getOne',
    method: 'post',
    data: data
  })
}
export function update (menu) {
  return request({
    url: 'sysMenu/update',
    method: 'post',
    data: menu
  })
}
export function remove (data) {
  return request({
    url: 'sysMenu/remove',
    method: 'post',
    data: data
  })
}
