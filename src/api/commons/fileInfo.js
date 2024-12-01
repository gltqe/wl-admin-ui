import request from '@/request'

export function getFileInfoList (ids) {
  return request({
    url: 'fileInfo/list',
    method: 'post',
    data: ids
  })
}
export function getFileInfo (data) {
  return request({
    url: 'fileInfo/getOne',
    method: 'post',
    data: data
  })
}
