import request from '@/utils/request'

//数据节点预览
export function evidenceContentNodeList(evidenceNodeId) {
  return request({
    url: '/edg/evidence/detail/' + evidenceNodeId,
    method: 'get',
  })
}
