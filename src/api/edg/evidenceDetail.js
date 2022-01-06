import request from '@/utils/request'

// 通过数据id查询所有数据节点
export function listAdminEvidenceDetail(evidenceId) {
  return request({
    url: '/edg/node/admin/evidence/' + evidenceId,
    method: 'get',
  })
}

// 通过数据id查询所有数据节点
export function listEvidenceDetail(evidenceId) {
  return request({
    url: '/edg/node/evidence/' + evidenceId,
    // url: '/edg/node/view/' + evidenceId,
    method: 'get',
  })
}

// 校验节点树
export function evidenceVerify(evidenceId) {
  return request({
    url: '/edg/evidence/verify/' + evidenceId,
    method: 'get',
  })
}

// 复制数据
export function evidenceCopy(evidenceNodeId) {
  const data = {
    evidenceNodeId: evidenceNodeId
  }
  return request({
    url: '/edg/evidence/copy/',
    method: 'post',
    params: data,
  })
}
