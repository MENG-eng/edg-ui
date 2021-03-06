import request from '@/utils/request'

// 查询文章管理列表Vo
export function listArticle(query) {
  return request({
    url: '/cms/article/list/vo',
    method: 'get',
    params: query
  })
}

// 查询文章管理详细
export function getArticle(articleId) {
  return request({
    url: '/cms/article/vo/' + articleId,
    method: 'get'
  })
}

// 新增文章管理
export function addArticle(data) {
  return request({
    url: '/cms/article',
    method: 'post',
    data: data
  })
}

// 修改文章管理
export function updateArticle(data) {
  return request({
    url: '/cms/article',
    method: 'put',
    data: data
  })
}

// 删除文章管理
export function delArticle(articleId) {
  return request({
    url: '/cms/article/' + articleId,
    method: 'delete'
  })
}

// 导出文章管理
export function exportArticle(query) {
  return request({
    url: '/cms/article/export',
    method: 'get',
    params: query
  })
}