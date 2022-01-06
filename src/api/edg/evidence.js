import request from '@/utils/request'

// 查询数据类型列表
export function listDataType() {
  return request({
    url: '/edg/type/select',
    method: 'get'
  })
}

// 数据查询列表
export function listEvidence(query) {
  return request({
    url: '/edg/evidence/list',
    method: 'get',
    params: query
  })
}

// 数据信息
export function evidenceNodeList(query) {
  return request({
    url: '/edg/node/list',
    method: 'get',
    params: query,
  })
}

// 校验数据名称是否重复
export function validEvidenceName(evidenceName) {
  return request({
    url: '/edg/evidence/valid/' + evidenceName,
    method: 'get',
  })
}

// 创建数据
export function createEvidence(data) {
  return request({
    url: '/edg/evidence/create',
    method: 'post',
    data: data,
  })
}

// 复制数据
export function copyEvidence(evidenceNodeId) {
  const data = {
    evidenceNodeId: evidenceNodeId
  }
  return request({
    url: '/edg/evidence/copy',
    method: 'post',
    params: data,
  })
}

// 增加数据
export function addEvidence(data) {
  return request({
    url: '/edg/evidence/add',
    method: 'post',
    data: data,
  })
}

// 修改数据
export function modifyEvidence(data) {
  return request({
    url: '/edg/evidence/modify',
    method: 'post',
    data: data,
  })
}

// 查询数据节点文件和附件
export function evidenceFiles(evidenceNodeId) {
  return request({
    url: '/edg/node/attachment/' + evidenceNodeId,
    method: 'get',
  })
}

//发布文章
/**
 *
 * @param {*} evidenceId 所属数据id
 * @param {*} title 文章标题
 * @param {*} categoryId 栏目id
 * @param {*} tagIds 标签
 * @param {*} keywords 关键词
 * @param {*} content 概述
 */
export function publishArticle(evidenceId, title, categoryId, tagIds, keywords, content) {
  const data = {
    evidenceId: evidenceId,
    title: title,
    categoryId: categoryId,
    tagIds: tagIds,
    keywords: keywords,
    content: content,
  }
  return request({
    url: '/cms/article',
    method: 'post',
    data: data,
  })
}

// 个人中心最近数据列表
export function userEvidenceList() {
  return request({
    url: '/edg/evidence/personal/list/latest',
    method: 'get',
  })
}

// 个人中心最近操作记录列表
export function userHandleList() {
  return request({
    url: '/edg/evidence/personal/node/list/latest',
    method: 'get',
  })
}

// 个人中心操作类型
export function handleType() {
  return request({
    url: '/edg/evidence/opt/type/statistics',
    method: 'get',
  })
}

// 数据被引用实况
export function quoteTotal() {
  return request({
    url: '/edg/evidence/quote/statistics',
    method: 'get',
  })
}

// 数据被引用次数TOP10
export function quoteTop() {
  return request({
    url: '/edg/evidence/quote/top10/statistics',
    method: 'get',
  })
}

//数据节点预览
export function evidenceNode(evidenceNodeId) {
  return request({
    url: '/edg/node/view/' + evidenceNodeId,
    method: 'get',
  })
}

// 数据附件列表
export function evidenceAttachment(evidenceNodeId) {
  return request({
    url: '/edg/attachment/list/' + evidenceNodeId,
    method: 'get',
  })
}

// 校验单链
export function evidenceNodeValid(evidenceNodeId) {
  return request({
    url: '/edg/node/verify/' + evidenceNodeId,
    method: 'get',
  })
}

// 最近一次溯源信息
export function lastVerifyInfo(evidenceNodeId) {
  return request({
    url: '/edg/node/last/verify/info/' + evidenceNodeId,
    method: 'get',
  })
}