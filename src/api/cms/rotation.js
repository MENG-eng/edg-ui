import request from '@/utils/request'

// 查询轮播图管理列表
export function listRotation(query) {
  return request({
    url: '/cms/rotation/list/vo',
    method: 'get',
    params: query
  })
}

// 查询轮播图管理详细
export function getRotation(rotationId) {
  return request({
    url: '/cms/rotation/vo/' + rotationId,
    method: 'get'
  })
}

// 新增轮播图管理
export function addRotation(data) {
  return request({
    url: '/cms/rotation',
    method: 'post',
    data: data
  })
}

// 修改轮播图管理
export function updateRotation(data) {
  return request({
    url: '/cms/rotation',
    method: 'put',
    data: data
  })
}

// 删除轮播图
export function delRotation(rotationId) {
  return request({
    url: '/cms/rotation/' + rotationId,
    method: 'delete'
  })
}

// 导出轮播图管理
export function exportRotation(query) {
  return request({
    url: '/cms/rotation/export',
    method: 'get',
    params: query
  })
}

// 图片上传
export function uploadRotation(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}

// 启用
export function enableRotation(rotationId) {
  return request({
    url: '/cms/rotation/enable/' + rotationId,
    method: 'put',
  })
}

// 禁用
export function disableRotation(rotationId) {
  return request({
    url: '/cms/rotation/disable/' + rotationId,
    method: 'put',
  })
}
