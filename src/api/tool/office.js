import request from '@/request'

export function fileHandle (data) {
  return request({
    url: 'office/fileHandle',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
