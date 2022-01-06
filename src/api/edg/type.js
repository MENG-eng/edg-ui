import request from '@/utils/request'

// 查询数据类型列表
export function listType(query) {
  return request({
    url: '/edg/type/list',
    method: 'get',
    params: query
  })
}

// 查询数据类型下拉
export function listTypeSelect() {
  return request({
    url: '/edg/type/select',
    method: 'get',
  })
}

// 查询数据类型详细
export function getType(id) {
  return request({
    url: '/edg/type/' + id,
    method: 'get'
  })
}

// 新增数据类型
export function addType(data) {
  return request({
    url: '/edg/type',
    method: 'post',
    data: data
  })
}

// 修改数据类型
export function updateType(data) {
  return request({
    url: '/edg/type',
    method: 'put',
    data: data
  })
}

// 删除数据类型
export function delType(id) {
  return request({
    url: '/edg/type/' + id,
    method: 'delete'
  })
}

// 导出数据类型
export function exportType(query) {
  return request({
    url: '/edg/type/export',
    method: 'get',
    params: query
  })
}

// 启用 禁用
export function enableType(id) {
  return request({
    url: '/edg/type/enable/' + id,
    method: 'put',
  })
}
