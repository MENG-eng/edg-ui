import request from '@/utils/request'

// 查询系统响应时间列表
export function listCostTime(query) {
  return request({
    url: '/monitor/costTime/list',
    method: 'get',
    params: query
  })
}

// 查询系统响应时间详细
export function getCostTime(id) {
  return request({
    url: '/monitor/costTime/' + id,
    method: 'get'
  })
}

// 新增系统响应时间
export function addCostTime(data) {
  return request({
    url: '/monitor/costTime',
    method: 'post',
    data: data
  })
}

// 修改系统响应时间
export function updateCostTime(data) {
  return request({
    url: '/monitor/costTime',
    method: 'put',
    data: data
  })
}

// 删除系统响应时间
export function delCostTime(id) {
  return request({
    url: '/monitor/costTime/' + id,
    method: 'delete'
  })
}

// 导出系统响应时间
export function exportCostTime(query) {
  return request({
    url: '/monitor/costTime/export',
    method: 'get',
    params: query
  })
}
