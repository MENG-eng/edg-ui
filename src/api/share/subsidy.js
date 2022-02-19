import request from '@/utils/request'

// 电量数据查询列表
export function listSubsidy(query) {
  return request({
    url: '/share/subsidy/list',
    method: 'get',
    params: query
  })
}

// 创建数据
export function createSubsidy(data) {
  return request({
    url: '/share/subsidy/create',
    method: 'post',
    data: data,
  })
}
