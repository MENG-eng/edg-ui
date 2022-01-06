import request from '@/utils/request'

// 溯源中心数据分页
export function evidenceListTrace(params) {
  return request({
    url: '/edg/evidence/list/trace',
    method: 'get',
    params: params,
  })
}
