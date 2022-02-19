import request from '@/utils/request'

// 电量数据查询列表
export function listElectric(query) {
  return request({
    url: '/share/electric/list',
    method: 'get',
    params: query
  })
}

// 导出电量数据
export function exportElectric(query) {
  return request({
    url: '/share/electric/export',
    method: 'get',
    params: query
  })
}
