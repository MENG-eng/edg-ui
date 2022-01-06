import request from '@/utils/request'

// 操作记录列表
export function listoptRecord(query) {
    return request({
      url: '/edg/evidence/personal/node/list',
      method: 'get',
      params: query
    })
  }

