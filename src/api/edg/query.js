import request from '@/utils/request'

// 查询数据类型列表
export function listQuery(query) {
  return request({
    url: '/edg/evidence/list',
    method: 'get',
    params: query
  })
}