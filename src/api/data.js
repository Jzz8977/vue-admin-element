import request from '@/utils/request'

export function fourTips(data) {
  return request({
    url: '/data/fourTips',
    method: 'post',
    data
  })
}
