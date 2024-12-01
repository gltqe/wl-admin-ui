import request from '@/request/index.js'

export function getUserInfo () {
  return request.post(
    'sysUser/getUserInfo'
  )
}

export function page (queryForm) {
  return request({
    url: 'sysUser/page',
    method: 'post',
    data: queryForm
  })
}

export function updateStatus (user) {
  return request({
    url: 'sysUser/updateStatus',
    method: 'post',
    data: user
  })
}

export function add (formData) {
  return request({
    url: 'sysUser/add',
    method: 'post',
    data: formData
  })
}

export function getOne (data) {
  return request({
    url: 'sysUser/getOne',
    method: 'post',
    data: data
  })
}

export function update (formData) {
  return request({
    url: 'sysUser/update',
    method: 'post',
    data: formData
  })
}

export function remove (ids) {
  return request({
    url: 'sysUser/remove',
    method: 'post',
    data: ids
  })
}
export function updateSelfPassword (password) {
  return request({
    url: 'sysUser/updateSelfPassword',
    method: 'post',
    data: password
  })
}
export function updateOtherPassword (password) {
  return request({
    url: 'sysUser/updateOtherPassword',
    method: 'post',
    data: password
  })
}
export function getSelfInfo () {
  return request({
    url: 'sysUser/getSelfInfo',
    method: 'post'
  })
}
export function updateSelf (formData) {
  return request({
    url: 'sysUser/updateSelf',
    method: 'post',
    data: formData
  })
}


export function exportUser (formData) {
  return request({
    url: 'sysUser/exportUser',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}
