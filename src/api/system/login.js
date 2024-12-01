import request from '@/request'

export function login (user) {
  return request({
    url: 'login',
    method: 'post',
    data: user
  })
}
export function getCaptcha () {
  return request({
    url: 'getCaptcha',
    method: 'post'
  })
}

export function refreshToken (data) {
  return request({
    url: 'refreshToken',
    method: 'post',
    data:data
  })
}

export function logout () {
  return request({
    url: 'logout',
    method: 'post'
  })
}
