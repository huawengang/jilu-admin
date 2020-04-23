import request from '@/utils/request'

export function listStock(query) {
  return request({
    url: '/stock/pagelist',
    method: 'get',
    params: query
  })
}

export function deleteStock(data) {
  return request({
    url: '/stock/delete',
    method: 'post',
    data
  })
}

export function inStock(data) {
  return request({
    url: '/stock/create',
    method: 'post',
    data
  })
}

export function listGoodsByStock(stockId) {
  return request({
    url: '/stock/listGoodsByStock',
    method: 'get',
    params: { stockId }
  })
}
