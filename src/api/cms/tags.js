import request from '@/utils/request'

// 查询标签管理列表
export function listTags(query) {
  return request({
    url: '/cms/tags/list',
    method: 'get',
    params: query
  })
}

// 查询标签管理详细
export function getTags(tagId) {
  return request({
    url: '/cms/tags/' + tagId,
    method: 'get'
  })
}

// 新增标签管理
export function addTags(data) {
  return request({
    url: '/cms/tags',
    method: 'post',
    data: data
  })
}

// 修改标签管理
export function updateTags(data) {
  return request({
    url: '/cms/tags',
    method: 'put',
    data: data
  })
}

// 删除标签管理
export function delTags(tagId) {
  return request({
    url: '/cms/tags/' + tagId,
    method: 'delete'
  })
}

// 导出标签管理
export function exportTags(query) {
  return request({
    url: '/cms/tags/export',
    method: 'get',
    params: query
  })
}

// 启用
export function enableTags(tagsId) {
  return request({
    url: '/cms/tags/enable/' + tagsId,
    method: 'put',
  })
}

// 禁用
export function disableTags(tagsId) {
  return request({
    url: '/cms/tags/disable/' + tagsId,
    method: 'put',
  })
}