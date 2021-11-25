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
 * @param username username belongs to the user who we want to change his/her password
 * @param password new password
 */
export const changeAdminPassword = async (username: string, password: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/password/',
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
    '/service/admin/node/list/',
    {
      method: 'GET',
      params: {
        current,
        pageSize,
        type
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
 */
export const createNode = async (host: string, password: string, type: string, username: string) => {
  return request<APP.Result<undefined>>(
    '/service/admin/node/create/',
    {
      method: 'POST',
      data: {
        host,
        password,
        type,
        username
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
    '/service/admin/node/delete/',
    {
      method: 'GET',
      params: {
        id
      }
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
    '/service/admin/node/approved/',
    {
      method: 'POST',
      data: {
        id,
        approved
      }
    }
  )
}
