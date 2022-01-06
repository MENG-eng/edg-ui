import request from '@/utils/request'

// 查询数据异常列表
export function listException(query) {
  return request({
    url: '/edg/exception/list',
    method: 'get',
    params: query
  })
}

// 查询数据异常详细
export function getException(id) {
  return request({
    url: '/edg/exception/' + id,
    method: 'get'
  })
}

// 新增数据异常
export function addException(data) {
  return request({
    url: '/edg/exception',
    method: 'post',
    data: data
  })
}

// 修改数据异常
export function updateException(data) {
  return request({
    url: '/edg/exception',
    method: 'put',
    data: data
  })
}

// 删除数据异常
export function delException(id) {
  return request({
    url: '/edg/exception/' + id,
    method: 'delete'
  })
}

// 导出数据异常
export function exportException(query) {
  return request({
    url: '/edg/exception/export',
    method: 'get',
    params: query
  })
}