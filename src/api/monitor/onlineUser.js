import request from '@/request/index'

export function getOnlineUserPage (data) {
  return request({
    url: 'onlineUser/page',
    method: 'post',
    data: data
  })
}

export function getOne (data) {
  return request({
    url: 'onlineUser/getOne',
    method: 'post',
    data:data
  })
}

export function exit (data) {
  return request({
    url: 'onlineUser/exit',
    method: 'post',
    data: data
  })
}
