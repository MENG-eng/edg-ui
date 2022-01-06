import request from '@/utils/request'

// 获取所有数据类型
export function listEvidenceType(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/edg/type/list/one',
    method: 'get',
    params: data,
  })
}

// 获取栏目统计列表
export function listCategoryTitle(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/cms/article/count/category',
    method: 'get',
    params: data,
  })
}

// 获取文章标签统计列表
export function listTagsTitle(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/cms/article/count/tags',
    method: 'get',
    params: data,
  })
}

// 获取机构列表
export function listDept(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/system/dept/list/second',
    method: 'get',
    params: data,
  })
}

// 获取机构详情
export function deptInfo(deptId) {
  return request({
    url: '/api/system/dept/info/' + deptId,
    method: 'get',
  })
}

// 轮播图
export function listRotation(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/cms/rotation/list/all',
    method: 'get',
    params: data,
  })
}

// 月份统计列表
export function listArticleMonth(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/cms/article/count/month',
    method: 'get',
    params: data,
  })
}

// 日分统计列表
export function listArticleDays(deptId, year, month) {
  const data = {
    deptId: deptId,
    year: year,
    month: month,
  }
  return request({
    url: '/api/cms/article/count/days',
    method: 'get',
    params: data,
  })
}

// 最新文章
export function listArticleNew(query) {
  return request({
    url: '/api/cms/article/list/new',
    method: 'get',
    params: query,
  })
}

// 公告
export function listNotice(deptId) {
  const data = {
    deptId: deptId,
  }
  return request({
    url: '/api/cms/article/notice/list',
    method: 'get',
    params: data,
  })
}
