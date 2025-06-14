import request from '@/request'

export function page (data) {
  return request({
    url: 'sysDictItem/page',
    method: 'post',
    data: data
  })
}
export function getDictItemByUser () {
  return request({
    url: 'sysDictItem/getDictItemByUser',
    method: 'post'
  })
}
export function updateStatus (dictItem) {
  return request({
    url: 'sysDictItem/updateStatus',
    method: 'post',
    data: dictItem
  })
}
export function add (dictItem) {
  return request({
    url: 'sysDictItem/add',
    method: 'post',
    data: dictItem
  })
}
export function getOne (data) {
  return request({
    url: 'sysDictItem/getOne',
    method: 'post',
    data: data
  })
}
export function update (dictItem) {
  return request({
    url: 'sysDictItem/update',
    method: 'post',
    data: dictItem
  })
}

export function remove (ids) {
  return request({
    url: 'sysDictItem/remove',
    method: 'post',
    data: ids
  })
}
