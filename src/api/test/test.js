import request from '@/request/index.js'

export function getTestInfoList (queryForm, url) {
  return request({
    url: 'testInfo/' + url,
    method: 'post',
    data: queryForm
  })
}
export function add (data) {
  return request({
    url: 'testInfo/add',
    method: 'post',
    data: data
  })
}
export function update (data) {
  return request({
    url: 'testInfo/update',
    method: 'post',
    data: data
  })
}
export function remove (data) {
  return request({
    url: 'testInfo/remove',
    method: 'post',
    data: data
  })
}
