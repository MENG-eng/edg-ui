import request from '@/utils/request'

// 我的数据分页
export function listMyEvidence(query) {
  return request({
    url: '/edg/evidence/list/my',
    method: 'get',
    params: query
  })
}

// 我复制的数据
export function listCopyEvidence(query) {
  return request({
    url: '/edg/evidence/list/copy',
    method: 'get',
    params: query
  })
}

//上传文件
export function uploadFile(data) {
  return request({
    url: 'http://47.93.243.23:9000/group1/update',
    method: 'post',
    data: data,
  })
}
