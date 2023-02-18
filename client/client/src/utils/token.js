/**
 * 获取当前 token
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * 保存 token
 */
export const setToken = token => {
  localStorage.setItem('token', token)
}

/**
 * 移除 token
 */
export const removeToken = () => {
  localStorage.removeItem('token')
}
