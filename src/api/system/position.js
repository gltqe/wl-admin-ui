import request from '@/request/index'

export function getPositionInfo () {
  return request.post(
    'sysPosition/getPositionInfo'
  )
}

export function page (data) {
  return request({
    url: 'sysPosition/page',
    method: 'post',
    data: data
  })
}

export function getPositionList () {
  return request({
    url: 'sysPosition/list',
    method: 'post'
  })
}

export function updateStatus (position) {
  return request({
    url: 'sysPosition/updateStatus',
    method: 'post',
    data: position
  })
}

export function add (formData) {
  return request({
    url: 'sysPosition/add',
    method: 'post',
    data: formData
  })
}

export function getOne (data) {
  return request({
    url: 'sysPosition/getOne',
    method: 'post',
    data: data
  })
}

export function update (formData) {
  return request({
    url: 'sysPosition/update',
    method: 'post',
    data: formData
  })
}

export function remove (ids) {
  return request({
    url: 'sysPosition/remove',
    method: 'post',
    data: ids
  })
}
export function updateSelfPassword (password) {
  return request({
    url: 'sysPosition/updateSelfPassword',
    method: 'post',
    data: password
  })
}
export function updateOtherPassword (password) {
  return request({
    url: 'sysPosition/updateOtherPassword',
    method: 'post',
    data: password
  })
}
export function getSelfInfo () {
  return request({
    url: 'sysPosition/getSelfInfo',
    method: 'post'
  })
}
export function updateSelf (formData) {
  return request({
    url: 'sysPosition/updateSelf',
    method: 'post',
    data: formData
  })
}

// 导出
export function exportPosition (formData) {
  return request({
    url: 'sysPosition/exportPosition',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}
