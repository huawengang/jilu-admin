import request from '@/utils/request'

export function listWarehouse() {
  return request({
    url: '/warehouse/list',
    method: 'get'
  })
}

export function pageWarehouse(query) {
  return request({
    url: '/warehouse/pagelist',
    method: 'get',
    params: query
  })
}

export function createWarehouse(data) {
  return request({
    url: '/warehouse/create',
    method: 'post',
    data
  })
}

export function readWarehouse(data) {
  return request({
    url: '/warehouse/read',
    method: 'get',
    data
  })
}

export function updateWarehouse(data) {
  return request({
    url: '/warehouse/update',
    method: 'post',
    data
  })
}

export function deleteWarehouse(data) {
  return request({
    url: '/warehouse/delete',
    method: 'post',
    data
  })
}
