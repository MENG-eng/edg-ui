import request from '@/utils/request'

// 查询附件列表
export function listAttachment(query) {
  return request({
    url: '/edg/attachment/list',
    method: 'get',
    params: query
  })
}

// 查询附件详细
export function getAttachment(id) {
  return request({
    url: '/edg/attachment/' + id,
    method: 'get'
  })
}

// 新增附件
export function addAttachment(data) {
  return request({
    url: '/edg/attachment',
    method: 'post',
    data: data
  })
}

// 修改附件
export function updateAttachment(data) {
  return request({
    url: '/edg/attachment',
    method: 'put',
    data: data
  })
}

// 删除附件
export function delAttachment(id) {
  return request({
    url: '/edg/attachment/' + id,
    method: 'delete'
  })
}

// 导出附件
export function exportAttachment(query) {
  return request({
    url: '/edg/attachment/export',
    method: 'get',
    params: query
  })
}