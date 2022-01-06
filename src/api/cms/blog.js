import request from '@/utils/request'

// 获取标签列表
export function listTagsTitle(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/cms/tags/list/all',
    method: 'get',
    params: data,
  })
}

// 获取栏目列表
export function listCategoryTitle(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/cms/category/list',
    method: 'get',
    params: data,
  })
}
