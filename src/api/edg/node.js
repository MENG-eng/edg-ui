import request from '@/utils/request'

// 查询数据节点列表
export function listNode(query) {
  return request({
    url: '/edg/node/list',
    method: 'get',
    params: query
  })
}

// 查询数据节点详细
export function getNode(id) {
  return request({
    url: '/edg/node/' + id,
    method: 'get'
  })
}

// 新增数据节点
export function addNode(data) {
  return request({
    url: '/edg/node',
    method: 'post',
    data: data
  })
}

// 修改数据节点
export function updateNode(data) {
  return request({
    url: '/edg/node',
    method: 'put',
    data: data
  })
}

// 删除数据节点
export function delNode(id) {
  return request({
    url: '/edg/node/' + id,
    method: 'delete'
  })
}

// 导出数据节点
export function exportNode(query) {
  return request({
    url: '/edg/node/export',
    method: 'get',
    params: query
  })
}