import request from '@/request/index'

export function getServerInfo () {
  return request({
    url: 'monitor/getServerInfo',
    method: 'post'
  })
}

export function getCpuInfo () {
  return request({
    url: 'monitor/getCpuInfo',
    method: 'post'
  })
}
export function getMemoryInfo () {
  return request({
    url: 'monitor/getMemoryInfo',
    method: 'post'
  })
}
export function getDiscInfo () {
  return request({
    url: 'monitor/getDiscInfo',
    method: 'post'
  })
}
