import request from '@/utils/request'

// 查询栏目管理列表
export function listCategory(query) {
  return request({
    url: '/cms/category/list',
    method: 'get',
    params: query
  })
}

// 查询栏目管理详细
export function getCategory(categoryId) {
  return request({
    url: '/cms/category/' + categoryId,
    method: 'get'
  })
}

// 查询所有栏目不包括自己
export function getOtherCategory(categoryId) {
  return request({
    url: '/cms/category/list/exclude/' + categoryId,
    method: 'get'
  })
}

// 新增栏目管理
export function addCategory(data) {
  return request({
    url: '/cms/category',
    method: 'post',
    data: data
  })
}

// 修改栏目管理
export function updateCategory(data) {
  return request({
    url: '/cms/category',
    method: 'put',
    data: data
  })
}

// 删除栏目管理
export function delCategory(categoryId) {
  return request({
    url: '/cms/category/' + categoryId,
    method: 'delete'
  })
}

// 导出栏目管理
export function exportCategory(query) {
  return request({
    url: '/cms/category/export',
    method: 'get',
    params: query
  })
}

// 启用
export function enablecategory(categoryId) {
  return request({
    url: '/cms/category/enable/' + categoryId,
    method: 'put',
  })
}

// 禁用
export function disablecategory(categoryId) {
  return request({
    url: '/cms/category/disable/' + categoryId,
    method: 'put',
  })
}