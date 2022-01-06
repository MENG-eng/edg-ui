import request from '@/utils/request'

// 数据统计
export function evidenceStatistics() {
  return request({
    url: '/edg/evidence/statistics',
    method: 'get',
  })
}

// 用户活跃度
export function userActivity() {
  return request({
    url: '/edg/evidence/user/activity',
    method: 'get',
  })
}

// 数据存量统计
export function fileSizeStatistics() {
  return request({
    url: '/edg/evidence/file/size/statistics',
    method: 'get',
  })
}

// 各类型数据占比统计
export function typeEvidenceStatistics() {
  return request({
    url: '/edg/evidence/type/statistics',
    method: 'get',
  })
}

// 数据量和异常统计
export function evidenceExceptionStatistics() {
  return request({
    url: '/edg/evidence/exception/statistics',
    method: 'get',
  })
}

// 共享热度top10 
export function evidenceQuoteTop10() {
  return request({
    url: '/edg/evidence/quote/top10/all/statistics',
    method: 'get',
  })
}

// 各能源数据本月数据
export function evidenceMonthStatistics() {
  return request({
    url: '/edg/evidence/month/statistics',
    method: 'get',
  })
}

// 最近操作记录
export function momentOpt() {
  return request({
    url: '/edg/evidence/all/node/list/latest',
    method: 'get',
  })
}

// 机构数量汇总
export function deptTotal() {
  return request({
    url: '/edg/type/count/dept',
    method: 'get',
  })
}

// 能源类型数量汇总
export function typeTotal() {
  return request({
    url: '/edg/type/count/type',
    method: 'get',
  })
}

// 数据类型数量汇总
export function evidenceTotal() {
  return request({
    url: '/edg/evidence/count/type',
    method: 'get',
  })
}

// 机构-能源类型-发布文章信息汇总
export function infoTotal() {
  return request({
    url: '/cms/article/count/dept',
    method: 'get',
  })
}

// 各类文章数量详情汇总
export function articleTotal() {
  return request({
    url: '/cms/article/count/type',
    method: 'get',
  })
}


// 无条件共享详情
export function evidenceShare() {
  return request({
    url: '/edg/evidence/count/type/copy',
    method: 'get',
  })
}

// 更新周期详情
export function updateInfo() {
  return request({
    url: '/edg/evidence/count/refresh',
    method: 'get',
  })
}
