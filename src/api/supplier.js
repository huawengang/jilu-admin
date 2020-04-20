import request from '@/utils/request'

export function listSupplier() {
  return request({
    url: '/supplier/list',
    method: 'get'
  })
}

export function pageSupplier(query) {
  return request({
    url: '/supplier/pagelist',
    method: 'get',
    params: query
  })
}

export function createSupplier(data) {
  return request({
    url: '/supplier/create',
    method: 'post',
    data
  })
}

export function readSupplier(data) {
  return request({
    url: '/supplier/read',
    method: 'get',
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: '/supplier/update',
    method: 'post',
    data
  })
}

export function deleteSupplier(data) {
  return request({
    url: '/supplier/delete',
    method: 'post',
    data
  })
}
