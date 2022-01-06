import request from '@/utils/request'

// 文章详情
export function articleContent(articleId) {
  return request({
    url: '/api/cms/article/detail/new/' + articleId,
    method: 'get',
  })
}
