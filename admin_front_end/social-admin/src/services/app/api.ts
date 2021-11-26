import {request} from "umi";


/**
 * Get admin users list
 * @param current current page number(Start from 1)
 * @param pageSize how many rows are contained in each page
 */
export const getAdminList = async (current: number, pageSize: number) => {
  return request<APP.Result<{data: APP.Admin[], total: number}>>(
    '/service/admin/list/',
    {
      method: 'GET',
      params: {
        current,
        pageSize
      }
    }
  )
}

/**
 * Change password of an admin user
 * @param adminId id belongs to the admin who we want to change his/her password
 * @param password new password
 */
export const changeAdminPassword = async (adminId: number, password: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/password/' + adminId + '/',
    {
      method: 'POST',
      data: {
        password
      }
    }
  )
}

/**
 * Create admin
 * @param username username of admin
 * @param password password of admin
 */
export const createAdmin = async (username: string, password: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/create/',
    {
      method: 'POST',
      data: {
        username,
        password
      }
    }
  )
}

/**
 * Get nodes list
 * @param current current page number(Start from 1)
 * @param pageSize how many rows are contained in each page
 * @param type node type
 */
export const getNodeList = async (current: number, pageSize: number, type: string) => {
  return request<APP.Result<{data: APP.Node[], total: number}>>(
    '/service/admin/node/list/' + type + '/',
    {
      method: 'GET',
      params: {
        current,
        pageSize
      }
    }
  )
}

/**
 * Create a new node
 * @param host host address of the new node
 * @param password password for this new node
 * @param type node type
 * @param username if the type is FETCH, api need an another argument: username, for HTTP Basic Auth
 * @param authorUrl
 * @param postUrl
 * @param nodeId
 */
export const createNode = async (
  host: string, password: string, type: string, username: string, authorUrl: string, postUrl: string, nodeId: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/node/create/' + type + '/',
    {
      method: 'POST',
      data: {
        host,
        password,
        username,
        authorUrl,
        postUrl,
        nodeId
      }
    }
  )
}

/**
 * Delete a particular node
 * @param id id of the node
 */
export const deleteNode = async (id: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/node/delete/' + id + '/',
    {
      method: 'DELETE'
    }
  )
}

/**
 * Set if the node has permission to connect this server
 * @param id id of the node
 * @param approvedIn if approved
 */
export const setNodeApproved = async (id: string, approvedIn: boolean) => {
  const approved = approvedIn ? '1' : '0'
  return request<APP.Result<undefined>>(
    '/service/admin/node/approved/' + id + '/',
    {
      method: 'POST',
      data: {
        approved
      }
    }
  )
}
