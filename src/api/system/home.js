import request from '@/request'
import axios from "axios";

export function ipInfo () {
  return request({
    url: 'home/ipInfo',
    method: 'post'
  })
}

